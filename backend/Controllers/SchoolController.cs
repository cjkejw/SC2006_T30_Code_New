using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs.School;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Console;
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

        [HttpGet]
        public async Task<IActionResult> Find([FromQuery(Name = "school")] string school)
        {
            var httpClient = _httpClientFactory.CreateClient();
            var fields = "school_name,address,zone_code,telephone_no,nature_code,email_address,url_address";
            var externalAPI = $"https://data.gov.sg/api/action/datastore_search?resource_id=d_688b934f82c1059ed0a6993d2a829089&fields={fields}&q={Uri.EscapeDataString($"{{\"school_name\": \"{school}\"}}")}";       
            try
            {
                var response = await httpClient.GetAsync(externalAPI);
                if(!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, "Error Calling External API");
                }

                var responseString = await response.Content.ReadAsStringAsync();
                var result = JObject.Parse(responseString);

                var schoolDetails = new Dictionary<String,SchoolDetailsDTO>();
                // if result or result["result"] is null then how thing become null
                foreach(var record in result["result"]?["records"]) 
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

    }
}