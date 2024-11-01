using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using System.Security.Claims;
using backend.DTOs.School;
using backend.DTOs.UserProfile;
using backend.Mappers;
using backend.Interface;
using backend.Models;
using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
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
         private readonly IUserProfileRepository _userProfileRepository;
         private readonly UserManager<WebUser> _userManager;

        public SchoolController(IHttpClientFactory httpClientFactory, IUserProfileRepository userProfileRepository, UserManager<WebUser> userManager)
        {
            _httpClientFactory = httpClientFactory;
            _userProfileRepository = userProfileRepository;
            _userManager = userManager;
        }

        [HttpGet("find")]
        public async Task<IActionResult> FindSchool([FromQuery(Name = "school")] string school)
        {
            var httpClient = _httpClientFactory.CreateClient();
            var query = Uri.EscapeDataString($"{{\"school_name\": \"{school}\"}}");
            var fields = "school_name,address,zone_code,telephone_no,nature_code,email_address,url_address";
            try
            {

                var response = await GetSchoolDetails(httpClient, query,fields);
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

        [Authorize]
        [HttpGet("recommend")]
        public async Task<IActionResult> RecommendSchools()
        {
            // Get the logged-in user's email from the JWT claims
            var userEmailClaim = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userEmailClaim))
            {
                return Unauthorized("User not authenticated.");
            }

            // Retrieve the user from the database using the email
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email.ToLower() == userEmailClaim.ToLower());

            if (user == null)
            {
                return Unauthorized("User not found.");
            }

            // Retrieve the user profile using the user ID
            var userProfile = await _userProfileRepository.GetUserProfileByUserIdAsync(user.Id);

            if (userProfile == null)
            {
                return NotFound("User profile not found.");
            }

            // Extract user preferences from the profile
            var preferredZone = userProfile.Location;
            var preferredSubject = userProfile.SubjectInterests;
            var preferredCCA = userProfile.CCA;
            var preferredEducationLevel = userProfile.EducationLevel;

            // Fetch all schools from the external API
            var httpClient = _httpClientFactory.CreateClient();
            httpClient.Timeout = TimeSpan.FromMinutes(5);

            // Fetch all schools in one go
            var schoolFields = "school_name,zone_code,address,telephone_no,nature_code,email_address,url_address,mainlevel_code";
            var schoolResponse = await GetSchoolDetails(httpClient, "", schoolFields);

            if (schoolResponse == null)
            {
                return StatusCode(500, "Error fetching schools.");
            }

            // Fetch subjects and CCAs in parallel
            var subjectFields = "SCHOOL_NAME,SUBJECT_DESC";
            var ccaFields = "school_name,cca_generic_name";

            var subjectTask = GetSubjectDetailsWithLimit(httpClient, "", subjectFields);
            var ccaTask = GetCCADetailsWithLimit(httpClient, "", ccaFields);
            await Task.WhenAll(subjectTask, ccaTask);

            var subjectResponse = await subjectTask;
            var ccaResponse = await ccaTask;

            if (subjectResponse == null || ccaResponse == null)
            {
                return StatusCode(500, "Error fetching subjects or CCA.");
            }

            // Step 4: Filter the schools based on input criteria
            var recommendedSchools = new Dictionary<string, RecommendSchoolDTO>();
            foreach (var record in schoolResponse["result"]?["records"])
            {
                var schoolName = record["school_name"]?.ToString();
                var schoolZone = record["zone_code"]?.ToString();
                var schoolEducationLevel = record["mainlevel_code"]?.ToString();

                // Check for matches
                bool matchesEducationLevel = preferredEducationLevel == "Not Specified" || schoolEducationLevel?.Equals(preferredEducationLevel, StringComparison.OrdinalIgnoreCase) == true;
                bool matchesZone = preferredZone == "Not Specified" || schoolZone?.Equals(preferredZone, StringComparison.OrdinalIgnoreCase) == true;

                if (!matchesEducationLevel || !matchesZone)
                {
                    continue;
                }

                // For Subjects
                var schoolSubjects = subjectResponse?["result"]?["records"]
                    ?.Where(s => s["SCHOOL_NAME"]?.ToString() == schoolName) // Filter by school_name
                    .Select(s => s["SUBJECT_DESC"]?.ToString()) // Select SUBJECT_DESC
                    .ToHashSet() ?? new HashSet<string?>();

                // For CCAs
                var schoolCCA = ccaResponse?["result"]?["records"]
                    ?.Where(c => c["school_name"]?.ToString() == schoolName) // Filter by school_name
                    .Select(c => c["cca_generic_name"]?.ToString()) // Select cca_generic_name
                    .ToHashSet() ?? new HashSet<string?>();

                bool matchesSubjects = preferredSubject == "Not Specified" || schoolSubjects.Any(s => s.Equals(preferredSubject, StringComparison.OrdinalIgnoreCase));
                bool matchesCCA = preferredCCA == "Not Specified" || schoolCCA.Any(c => c.Equals(preferredCCA, StringComparison.OrdinalIgnoreCase));

                if (matchesSubjects && matchesCCA)
                {
                    recommendedSchools[schoolName] = new RecommendSchoolDTO
                    {
                        Address = record["address"]?.ToString(),
                        ZoneCode = schoolZone,
                        TelephoneNo = record["telephone_no"]?.ToString(),
                        NatureCode = record["nature_code"]?.ToString(),
                        Email = record["email_address"]?.ToString(),
                        UrlAddress = record["url_address"]?.ToString(),
                        Subjects = schoolSubjects.ToList(), // Convert HashSet back to List
                        CCA = schoolCCA.ToList(),
                    };
                }
            }
            return Ok(recommendedSchools);
        }

        [HttpGet("compare")]
        public async Task<IActionResult> CompareSchools([FromQuery] string school1, [FromQuery] string school2)
        {
            var schools = new List<string> {school1,school2};
            var result = new Dictionary<string, CompareSchoolDTO>();
            foreach(var school in schools)
            {
                var subjectSet = new HashSet<string>();
                //var distinctSet = new HashSet<string>();
                var ccaSet = new HashSet<string>();

                var httpClient = _httpClientFactory.CreateClient();

                var school_fields = "school_name,zone_code,address";
                var query = Uri.EscapeDataString($"{{\"school_name\": \"{school}\"}}");
                var school_response = await GetSchoolDetails(httpClient, query, school_fields);
                
                var subject_fields = "SUBJECT_DESC";
                var subject_response = await GetSubjectDetails(httpClient, school, subject_fields);

                // var distinct_fields = "alp_title";
                // var distinct_response = await GetDistinctDetails(httpClient, school, distinct_fields);

                var cca_fields = "cca_generic_name";
                var cca_response = await GetCCADetails(httpClient, school, cca_fields);

                if(school_response == null || subject_response == null || /*distinct_response == null ||*/ cca_response == null)
                {
                    return StatusCode(500,"Error check console");
                }

                foreach (var subject in subject_response["result"]?["records"])
                {
                    subjectSet.Add(subject["SUBJECT_DESC"].ToString());
                }

                // foreach (var distinct in distinct_response["result"]?["records"])
                // {
                //     distinctSet.Add(distinct["alp_title"].ToString());
                // }

                foreach (var cca in cca_response["result"]?["records"])
                {
                    ccaSet.Add(cca["cca_generic_name"].ToString());
                }

                var CompareSchoolDTO = new CompareSchoolDTO
                {
                    Zone = school_response["result"]["records"][0]["zone_code"].ToString(),
                    Location = school_response["result"]["records"][0]["address"].ToString(),
                    Subjects = subjectSet.ToList(),  // Convert back to list
                    //Programmes = distinctSet.ToList(),
                    CCA = ccaSet.ToList()
                };
                result[school] = CompareSchoolDTO;
            }
 
            return Ok(result);
        }

        [HttpGet("filter")]
        public async Task<IActionResult> FilterSchools(
            [FromQuery] string subjects = "",
            [FromQuery] string cca = "",
            [FromQuery] string zone = "",
            [FromQuery] string educationLevel = "")
        {
            var httpClient = _httpClientFactory.CreateClient();
            httpClient.Timeout = TimeSpan.FromMinutes(5);

            // Fetch all schools in one go
            var schoolFields = "school_name,zone_code,address,telephone_no,nature_code,email_address,url_address,mainlevel_code";
            var schoolResponse = await GetSchoolDetails(httpClient, "", schoolFields);

            if (schoolResponse == null)
            {
                return StatusCode(500, "Error fetching schools.");
            }

            // Fetch subjects and CCAs in parallel
            var subjectFields = "SCHOOL_NAME,SUBJECT_DESC";
            var ccaFields = "school_name,cca_generic_name";

            var subjectTask = GetSubjectDetailsWithLimit(httpClient, "", subjectFields);
            var ccaTask = GetCCADetailsWithLimit(httpClient, "", ccaFields);
            await Task.WhenAll(subjectTask, ccaTask);

            var subjectResponse = await subjectTask;
            var ccaResponse = await ccaTask;

            if (subjectResponse == null || ccaResponse == null)
            {
                return StatusCode(500, "Error fetching subjects or CCA.");
            }

            // Step 4: Filter the schools based on input criteria
            var filteredSchools = new Dictionary<string, SchoolDetailsDTO>();
            foreach (var record in schoolResponse["result"]?["records"])
            {
                var schoolName = record["school_name"]?.ToString();
                var schoolZone = record["zone_code"]?.ToString();
                var schoolEducationLevel = record["mainlevel_code"]?.ToString();

                // Check for matches
                bool matchesEducationLevel = string.IsNullOrEmpty(educationLevel) || schoolEducationLevel?.Equals(educationLevel, StringComparison.OrdinalIgnoreCase) == true;
                bool matchesZone = string.IsNullOrEmpty(zone) || schoolZone?.Equals(zone, StringComparison.OrdinalIgnoreCase) == true;

                if (!matchesEducationLevel || !matchesZone)
                {
                    continue;
                }

                // For Subjects
                var schoolSubjects = subjectResponse?["result"]?["records"]
                    ?.Where(s => s["SCHOOL_NAME"]?.ToString() == schoolName) // Filter by school_name
                    .Select(s => s["SUBJECT_DESC"]?.ToString()) // Select SUBJECT_DESC
                    .ToHashSet() ?? new HashSet<string?>();

                // For CCAs
                var schoolCCA = ccaResponse?["result"]?["records"]
                    ?.Where(c => c["school_name"]?.ToString() == schoolName) // Filter by school_name
                    .Select(c => c["cca_generic_name"]?.ToString()) // Select cca_generic_name
                    .ToHashSet() ?? new HashSet<string?>();

                bool matchesSubjects = string.IsNullOrEmpty(subjects) || schoolSubjects.Any(s => s.Equals(subjects, StringComparison.OrdinalIgnoreCase));
                bool matchesCCA = string.IsNullOrEmpty(cca) || schoolCCA.Any(c => c.Equals(cca, StringComparison.OrdinalIgnoreCase));

                if (matchesSubjects && matchesCCA)
                {
                    filteredSchools[schoolName] = new SchoolDetailsDTO
                    {
                        Address = record["address"]?.ToString(),
                        ZoneCode = schoolZone,
                        TelephoneNo = record["telephone_no"]?.ToString(),
                        NatureCode = record["nature_code"]?.ToString(),
                        Email = record["email_address"]?.ToString(),
                        UrlAddress = record["url_address"]?.ToString(),
                    };
                }
            }

            return Ok(filteredSchools);
        }

        private async Task<JObject?> GetSchoolDetails(HttpClient httpClient,string query, string fields)
        {
            var externalAPI = $"https://data.gov.sg/api/action/datastore_search?resource_id=d_688b934f82c1059ed0a6993d2a829089&fields={fields}&q={query}&limit={400}";       

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

        private async Task<JObject?> GetCCADetailsWithLimit(HttpClient httpClient, string school, string fields)
        {
            var externalAPI = $"https://data.gov.sg/api/action/datastore_search?resource_id=d_9aba12b5527843afb0b2e8e4ed6ac6bd&fields={fields}&q={school}&limit={5500}";       

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

        private async Task<JObject?> GetSubjectDetailsWithLimit(HttpClient httpClient, string school, string fields)
        {
            var externalAPI = $"https://data.gov.sg/api/action/datastore_search?resource_id=d_f1d144e423570c9d84dbc5102c2e664d&fields={fields}&q={school}&limit={11000}";       

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
