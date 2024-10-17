using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using backend.DTOs.School;
using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Console;
using Microsoft.Extensions.ObjectPool;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;


namespace backend.Controllers
{
    [ApiController]
    [Route("/school")]
    public class SchoolController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public SchoolController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpGet("find")]
        public async Task<IActionResult> FindSchool([FromQuery(Name = "school")] string school)
        {
            var httpClient = _httpClientFactory.CreateClient();
            var fields = "school_name,address,zone_code,telephone_no,nature_code,email_address,url_address";
            var externalAPI = $"https://data.gov.sg/api/action/datastore_search?resource_id=d_688b934f82c1059ed0a6993d2a829089&fields={fields}&q={Uri.EscapeDataString($"{{\"school_name\": \"{school}\"}}")}";       
            try
            {

                var response = await GetSchoolDetails(httpClient, school,fields);
                if(response == null)
                {
                    return StatusCode(500,"Error check console");
                }

                var schoolDetails = new Dictionary<String,SchoolDetailsDTO>();
                // if result or result["result"] is null then whole thing become null
                foreach(var record in response["result"]?["records"]) 
                {
                    var schoolName = record["school_name"]?.ToString();
                    if(!string.IsNullOrEmpty(schoolName))
                    {
                        var SchoolDetailsDTO = new SchoolDetailsDTO
                        {
                            Address = record["address"]?.ToString(),
                            ZoneCode = record["zone_code"]?.ToString(),
                            TelephoneNo = record["telephone_no"]?.ToString(),
                            NatureCode = record["nature_code"]?.ToString(),
                            Email = record["email_address"]?.ToString(),
                            UrlAddress = record["url_address"]?.ToString()               
                        };
                        schoolDetails[schoolName] = SchoolDetailsDTO;
                    }
                    
                }
                return Ok(schoolDetails);
            }

            catch (Exception e)
            {
                // any errors during request
                return StatusCode(500,$"Error: {e.Message}");
            }
        
        }

        [HttpGet("compare")]
        public async Task<IActionResult> CompareSchools([FromQuery] string school1, [FromQuery] string school2)
        {
            var schools = new List<string> {school1,school2};
            var result = new Dictionary<string, CompareSchoolDTO>();
            foreach(var school in schools)
            {
                var subject_list = new List<string>();
                var distinct_list = new List<string>();
                var cca_list = new List<string>();

                var httpClient = _httpClientFactory.CreateClient();

                var school_fields = "school_name,zone_code,address";
                var school_response = await GetSchoolDetails(httpClient, school, school_fields);
                
                var subject_fields = "SUBJECT_DESC";
                var subject_response = await GetSubjectDetails(httpClient, school, subject_fields);

                var distinct_fields = "alp_title";
                var distinct_response = await GetDistinctDetails(httpClient, school, distinct_fields);

                var cca_fields = "cca_generic_name";
                var cca_response = await GetCCADetails(httpClient, school, cca_fields);

                if(school_response == null || subject_response == null || distinct_response == null ||cca_response == null)
                {
                    return StatusCode(500,"Error check console");
                }

                foreach(var subject in subject_response["result"]?["records"])
                {
                    subject_list.Add(subject["SUBJECT_DESC"].ToString());
                }

                foreach(var distinct in distinct_response["result"]?["records"])
                {
                    distinct_list.Add(distinct["alp_title"].ToString());
                }

                foreach(var cca in cca_response["result"]?["records"])
                {
                    cca_list.Add(cca["cca_generic_name"].ToString());
                }

                var CompareSchoolDTO = new CompareSchoolDTO
                {
                    Zone = school_response["result"]["records"][0]["zone_code"].ToString(),
                    Location = school_response["result"]["records"][0]["address"].ToString(),
                    Subjects = subject_list,
                    Programmes = distinct_list,
                    CCA = cca_list
                };
                result[school] = CompareSchoolDTO;
            }
 
            return Ok(result);
        }


        private async Task<JObject?> GetSchoolDetails(HttpClient httpClient, string school, string fields)
        {
            var externalAPI = $"https://data.gov.sg/api/action/datastore_search?resource_id=d_688b934f82c1059ed0a6993d2a829089&fields={fields}&q={Uri.EscapeDataString($"{{\"school_name\": \"{school}\"}}")}";       

            try
            {
                var response = await httpClient.GetAsync(externalAPI);
                if(!response.IsSuccessStatusCode)
                {
                    Console.WriteLine("ERROR CALLING EXTERNAL API FOR SCHOOL DETAILS");
                    return null;
                }
                var responseString = await response.Content.ReadAsStringAsync();
                var result = JObject.Parse(responseString);
                return result;
            }
            
            catch (Exception e)
            {
                Console.WriteLine($"An error occured: {e.Message}");
                return null;
            }
        }

        //field = cca_generic_name
        private async Task<JObject?> GetCCADetails(HttpClient httpClient, string school, string fields)
        {
            var externalAPI = $"https://data.gov.sg/api/action/datastore_search?resource_id=d_9aba12b5527843afb0b2e8e4ed6ac6bd&fields={fields}&q={Uri.EscapeDataString($"{{\"school_name\": \"{school}\"}}")}";       

            try
            {
                var response = await httpClient.GetAsync(externalAPI);
                if(!response.IsSuccessStatusCode)
                {
                    Console.WriteLine("ERROR CALLING EXTERNAL API FOR CCA");
                    return null;
                }
                var responseString = await response.Content.ReadAsStringAsync();
                var result = JObject.Parse(responseString);
                return result;
            }
            
            catch (Exception e)
            {
                Console.WriteLine($"An error occured: {e.Message}");
                return null;
            }
        }

        // fields = alp_title
        private async Task<JObject?> GetDistinctDetails(HttpClient httpClient, string school, string fields)
        {
            var externalAPI = $"https://data.gov.sg/api/action/datastore_search?resource_id=d_db1faeea02c646fa3abccfa5aba99214&fields={fields}&q={Uri.EscapeDataString($"{{\"school_name\": \"{school}\"}}")}";       

            try
            {
                var response = await httpClient.GetAsync(externalAPI);
                if(!response.IsSuccessStatusCode)
                {
                    Console.WriteLine("ERROR CALLING EXTERNAL API FOR DISTINCT");
                    return null;
                }
                var responseString = await response.Content.ReadAsStringAsync();
                var result = JObject.Parse(responseString);
                return result;
            }
            
            catch (Exception e)
            {
                Console.WriteLine($"An error occured: {e.Message}");
                return null;
            }
        }

        private async Task<JObject?> GetSubjectDetails(HttpClient httpClient, string school, string fields)
        {
            var externalAPI = $"https://data.gov.sg/api/action/datastore_search?resource_id=d_f1d144e423570c9d84dbc5102c2e664d&fields={fields}&q={Uri.EscapeDataString($"{{\"SCHOOL_NAME\": \"{school}\"}}")}";       

            try
            {
                var response = await httpClient.GetAsync(externalAPI);
                if(!response.IsSuccessStatusCode)
                {
                    Console.WriteLine("ERROR CALLING EXTERNAL API FOR SUBJECT");
                    return null;
                }
                var responseString = await response.Content.ReadAsStringAsync();
                var result = JObject.Parse(responseString);
                return result;
            }
            
            catch (Exception e)
            {
                Console.WriteLine($"An error occured: {e.Message}");
                return null;
            }
        }
    }
}