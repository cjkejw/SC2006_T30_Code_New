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
            var schoolFields = "school_name,zone_code,address,telephone_no,nature_code,email_address,url_address,mainlevel_code";
            var schoolResponse = await GetSchoolDetails(httpClient, "", schoolFields);  // Pass empty string to fetch all schools
            Console.WriteLine(schoolResponse);
            if (schoolResponse == null)
            {
                return StatusCode(500, "Error fetching schools.");
            }

            var recommendedSchools = new Dictionary<String,RecommendSchoolDTO>();

            // Loop through the school records and filter based on user profile preferences
            foreach (var record in schoolResponse["result"]?["records"])
            {
                var schoolZone = record["zone_code"]?.ToString();
                var schoolEducationLevel = record["mainlevel_code"]?.ToString();
                var schoolName = record["school_name"]?.ToString();
                // Apply zone filter if zone is not "Not Specified"
                if (preferredZone != "Not Specified" && !string.Equals(schoolZone, preferredZone, StringComparison.OrdinalIgnoreCase))
                {
                    continue; // Skip schools that don't match the zone
                }

                if (preferredEducationLevel != "Not Specified" && !string.Equals(schoolEducationLevel, preferredEducationLevel, StringComparison.OrdinalIgnoreCase))
                {
                    continue; // Skip schools that don't match the zone
                }

                var schoolDetails = new RecommendSchoolDTO
                {
                    Address = record["address"]?.ToString(),
                    ZoneCode = record["zone_code"]?.ToString(),
                    TelephoneNo = record["telephone_no"]?.ToString(),
                    NatureCode = record["nature_code"]?.ToString(),
                    Email = record["email_address"]?.ToString(),
                    UrlAddress = record["url_address"]?.ToString(),
                };

                // Get subjects, and CCA for the school
                var subjectFields = "SUBJECT_DESC";
                var subjectResponse = await GetSubjectDetails(httpClient, record["school_name"]?.ToString(), subjectFields);
                var ccaFields = "cca_generic_name";
                var ccaResponse = await GetCCADetails(httpClient, record["school_name"]?.ToString(), ccaFields);

                if( subjectResponse == null || ccaResponse == null)
                {
                    return StatusCode(500,"Error check console");
                }

                // Using HashSet to prevent duplicate entries
                var schoolSubjects = subjectResponse?["result"]?["records"]?.Select(s => s["SUBJECT_DESC"].ToString()).ToHashSet() ?? new HashSet<string>();
                var schoolCCA = ccaResponse?["result"]?["records"]?.Select(c => c["cca_generic_name"].ToString()).ToHashSet() ?? new HashSet<string>();

                // Check if the school matches the subjects, and CCA filters
                bool matchesSubjects = preferredSubject == "Not Specified" || schoolSubjects.Any(s => s.Contains(preferredSubject, StringComparison.OrdinalIgnoreCase));
                bool matchesCCA = preferredCCA == "Not Specified" || schoolCCA.Any(c => c.Contains(preferredCCA, StringComparison.OrdinalIgnoreCase));

                // Add school if it matches any of the filters
                if (matchesSubjects && matchesCCA)
                {
                    schoolDetails.Subjects = schoolSubjects.ToList(); // Convert HashSet back to List
                    schoolDetails.CCA = schoolCCA.ToList();
                    recommendedSchools[schoolName] = schoolDetails;
                }
            }
            // Return the list of recommended schools
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
            var schoolFields = "school_name,zone_code,address,telephone_no,nature_code,email_address,url_address,mainlevel_code";
            var schoolResponse = await GetSchoolDetails(httpClient, "", schoolFields); // Fetch all schools

            if (schoolResponse == null)
            {
                return StatusCode(500, "Error fetching schools.");
            }

            var filteredSchools = new Dictionary<String,SchoolDetailsDTO>();

            foreach (var record in schoolResponse["result"]?["records"])
            {
                var schoolEducationLevel = record["mainlevel_code"]?.ToString();
                var schoolZone = record["zone_code"]?.ToString();
                var schoolName = record["school_name"]?.ToString();

                // Check if the school matches the education level and zone
                bool matchesEducationLevel = string.IsNullOrEmpty(educationLevel) || schoolEducationLevel.Equals(educationLevel, StringComparison.OrdinalIgnoreCase);
                bool matchesZone = string.IsNullOrEmpty(zone) || schoolZone.Equals(zone, StringComparison.OrdinalIgnoreCase);

                // Continue only if school matches both zone and education level criteria
                if (!matchesEducationLevel || !matchesZone)
                {
                    continue;
                }

                var schoolDetails = new SchoolDetailsDTO
                {
                    Address = record["address"]?.ToString(),
                    ZoneCode = schoolZone,
                    TelephoneNo = record["telephone_no"]?.ToString(),
                    NatureCode = record["nature_code"]?.ToString(),
                    Email = record["email_address"]?.ToString(),
                    UrlAddress = record["url_address"]?.ToString(),
                };

                // Get subjects, and CCA for the school
                var subjectFields = "SUBJECT_DESC";
                var subjectResponse = await GetSubjectDetails(httpClient, schoolName, subjectFields);
                var ccaFields = "cca_generic_name";
                var ccaResponse = await GetCCADetails(httpClient, schoolName, ccaFields);

                if( subjectResponse == null || ccaResponse == null)
                {
                    return StatusCode(500,"Error check console");
                }

                var schoolSubjects = subjectResponse?["result"]?["records"]?.Select(s => s["SUBJECT_DESC"].ToString()).ToHashSet() ?? new HashSet<string>();
                var schoolCCA = ccaResponse?["result"]?["records"]?.Select(c => c["cca_generic_name"].ToString()).ToHashSet() ?? new HashSet<string>();

                // Check if the school matches the subjects, and CCA filters
                bool matchesSubjects = string.IsNullOrEmpty(subjects) || schoolSubjects.Any(s => s.Contains(subjects, StringComparison.OrdinalIgnoreCase));
                bool matchesCCA = string.IsNullOrEmpty(cca) || schoolCCA.Any(c => c.Contains(cca, StringComparison.OrdinalIgnoreCase));

                // Add school if it matches any of the filters
                if (matchesSubjects && matchesCCA)
                {
                    filteredSchools[schoolName] = (schoolDetails);
                }
            }

            return Ok(filteredSchools);
        }


        private async Task<JObject?> GetSchoolDetails(HttpClient httpClient,string query, string fields)
        {
            var externalAPI = $"https://data.gov.sg/api/action/datastore_search?resource_id=d_688b934f82c1059ed0a6993d2a829089&fields={fields}&q={query}&limit={1000}";       

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
