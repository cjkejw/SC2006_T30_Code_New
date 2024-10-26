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

        [HttpGet("filter2")]
        public async Task<IActionResult> FilterSchools2(
            [FromQuery] string subjects = "",
            [FromQuery] string cca = "",
            [FromQuery] string zone = "",
            [FromQuery] string educationLevel = "")
        {
            var httpClient = _httpClientFactory.CreateClient();
            httpClient.Timeout = TimeSpan.FromMinutes(5);
    
            // Step 1: Fetch all schools
            var schoolFields = "school_name,zone_code,address,telephone_no,nature_code,email_address,url_address,mainlevel_code";
            var schoolResponse = await GetSchoolDetails(httpClient, "", schoolFields); // Fetch all schools

            if (schoolResponse == null)
            {
                return StatusCode(500, "Error fetching schools.");
            }

            // Step 2: Fetch all subjects and CCAs
            var subjectFields = "SCHOOL_NAME,SUBJECT_DESC";
            var ccaFields = "school_name,cca_generic_name";
            
            var subjectResponse = await GetSubjectDetails3(httpClient, "", subjectFields); // Fetch all subjects
            var ccaResponse = await GetCCADetails3(httpClient, "", ccaFields); // Fetch all CCAs

            if (subjectResponse == null || ccaResponse == null)
            {
                return StatusCode(500, "Error fetching subjects or CCA.");
            }

            // Step 3: Create dictionaries for quick lookup by school name
            // Group the subjects by school name and store them in a dictionary
            var schoolSubjectsMap = new Dictionary<string, HashSet<string>>();
            foreach (var record in subjectResponse["result"]?["records"])
            {
                var schoolName = record["SCHOOL_NAME"]?.ToString();
                var subjectDesc = record["SUBJECT_DESC"]?.ToString();

                if (!string.IsNullOrEmpty(schoolName) && !string.IsNullOrEmpty(subjectDesc))
                {
                    // If the school is already in the map, add the subject to its set
                    if (schoolSubjectsMap.ContainsKey(schoolName))
                    {
                        schoolSubjectsMap[schoolName].Add(subjectDesc);
                    }
                    else
                    {
                        // Otherwise, create a new entry for the school
                        schoolSubjectsMap[schoolName] = new HashSet<string> { subjectDesc };
                    }
                }
            }

            // Dictionary for CCAs: { "school_name" => HashSet of CCA names }
           var schoolCCAMap = new Dictionary<string, HashSet<string>>();
            foreach (var record in ccaResponse["result"]?["records"])
            {
                var schoolName = record["school_name"]?.ToString();
                var ccaGenericName = record["cca_generic_name"]?.ToString();

                if (!string.IsNullOrEmpty(schoolName) && !string.IsNullOrEmpty(ccaGenericName))
                {
                    // If the school is already in the map, add the subject to its set
                    if (schoolCCAMap.ContainsKey(schoolName))
                    {
                        schoolCCAMap[schoolName].Add(ccaGenericName);
                    }
                    else
                    {
                        // Otherwise, create a new entry for the school
                        schoolCCAMap[schoolName] = new HashSet<string> { ccaGenericName };
                    }
                }
            }
            // Step 4: Filter the schools based on input criteria
            var filteredSchools = new Dictionary<string, SchoolDetailsDTO>();

            foreach (var record in schoolResponse["result"]?["records"])
            {
                var schoolName = record["school_name"]?.ToString();
                var schoolZone = record["zone_code"]?.ToString();
                var schoolEducationLevel = record["mainlevel_code"]?.ToString();

                // Check if the school matches the education level and zone filters
                bool matchesEducationLevel = string.IsNullOrEmpty(educationLevel) || schoolEducationLevel.Equals(educationLevel, StringComparison.OrdinalIgnoreCase);
                bool matchesZone = string.IsNullOrEmpty(zone) || schoolZone.Equals(zone, StringComparison.OrdinalIgnoreCase);

                // Skip the school if it doesn't match the criteria
                if (!matchesEducationLevel || !matchesZone)
                {
                    continue;
                }

                // Look up subjects and CCAs for this school
                var schoolSubjects = schoolSubjectsMap.ContainsKey(schoolName) ? schoolSubjectsMap[schoolName] : new HashSet<string>();
                var schoolCCA = schoolCCAMap.ContainsKey(schoolName) ? schoolCCAMap[schoolName] : new HashSet<string>();

                // Check if the school matches the subjects and CCA filters
                bool matchesSubjects = string.IsNullOrEmpty(subjects) || schoolSubjects.Any(s => s.Contains(subjects, StringComparison.OrdinalIgnoreCase));
                bool matchesCCA = string.IsNullOrEmpty(cca) || schoolCCA.Any(c => c.Contains(cca, StringComparison.OrdinalIgnoreCase));

                // Add the school to the result set if it matches the filters
                if (matchesSubjects && matchesCCA)
                {
                    var schoolDetails = new SchoolDetailsDTO
                    {
                        Address = record["address"]?.ToString(),
                        ZoneCode = schoolZone,
                        TelephoneNo = record["telephone_no"]?.ToString(),
                        NatureCode = record["nature_code"]?.ToString(),
                        Email = record["email_address"]?.ToString(),
                        UrlAddress = record["url_address"]?.ToString(),
                    };

                    filteredSchools[schoolName] = schoolDetails;
                }
            }

            // Return the filtered result
            return Ok(filteredSchools);
        }

        [HttpGet("filter3")]
        public async Task<IActionResult> FilterSchools3(
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

            var subjectTask = GetSubjectDetails3(httpClient, "", subjectFields);
            var ccaTask = GetCCADetails3(httpClient, "", ccaFields);
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


        [HttpGet("testCCA")]
        public async Task<IActionResult> TestCCA(){
            // Fetch all schools from the external API
            var httpClient = _httpClientFactory.CreateClient();
            var ccaFields = "school_name,cca_generic_name";
            var ccaResponse = await GetCCADetails2(httpClient, "", ccaFields); // Fetch all CCAs
            if (ccaResponse == null)
            {
                return StatusCode(500, "Error fetching schools.");
            }
            var schoolSubjectsMap = new Dictionary<string, HashSet<string>>();
            foreach (var record in ccaResponse["result"]?["records"])
            {
                var schoolName = record["school_name"]?.ToString();
                var ccaGenericName = record["cca_generic_name"]?.ToString();

                if (!string.IsNullOrEmpty(schoolName) && !string.IsNullOrEmpty(ccaGenericName))
                {
                    // If the school is already in the map, add the subject to its set
                    if (schoolSubjectsMap.ContainsKey(schoolName))
                    {
                        schoolSubjectsMap[schoolName].Add(ccaGenericName);
                    }
                    else
                    {
                        // Otherwise, create a new entry for the school
                        schoolSubjectsMap[schoolName] = new HashSet<string> { ccaGenericName };
                    }
                }
            }
            return Ok(schoolSubjectsMap);
        }

        [HttpGet("testSub")]
        public async Task<IActionResult> TestSub()
        {
            var httpClient = _httpClientFactory.CreateClient();
            var subjectFields = "SCHOOL_NAME,SUBJECT_DESC";

            // Fetch all subjects using the paginated method
            var allSubjects = await GetSubjectDetails2(httpClient, "", subjectFields);
            if (allSubjects == null)
            {
                return StatusCode(500, "Error fetching subjects.");
            }

            // Group the subjects by school name and store them in a dictionary
            var schoolSubjectsMap = new Dictionary<string, HashSet<string>>();
            foreach (var record in allSubjects["result"]?["records"])
            {
                var schoolName = record["SCHOOL_NAME"]?.ToString();
                var subjectDesc = record["SUBJECT_DESC"]?.ToString();

                if (!string.IsNullOrEmpty(schoolName) && !string.IsNullOrEmpty(subjectDesc))
                {
                    // If the school is already in the map, add the subject to its set
                    if (schoolSubjectsMap.ContainsKey(schoolName))
                    {
                        schoolSubjectsMap[schoolName].Add(subjectDesc);
                    }
                    else
                    {
                        // Otherwise, create a new entry for the school
                        schoolSubjectsMap[schoolName] = new HashSet<string> { subjectDesc };
                    }
                }
            }

            return Ok(schoolSubjectsMap);
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

        private async Task<JObject?> GetCCADetails2(HttpClient httpClient, string school, string fields)
        {
            var limit = 100; // Set a reasonable batch size
            var offset = 0;  // Start with the first batch
            var allRecords = new JArray(); // JArray to store all the records

            try
            {
                while (true)
                {
                    // Prepare the API URL with pagination parameters
                    var externalAPI = $"https://data.gov.sg/api/action/datastore_search?resource_id=d_9aba12b5527843afb0b2e8e4ed6ac6bd&fields={fields}&q={school}&limit={limit}&offset={offset}";       

                    // Make the API request
                    var response = await httpClient.GetAsync(externalAPI);
                    if (!response.IsSuccessStatusCode)
                    {
                        Console.WriteLine("ERROR CALLING EXTERNAL API FOR SUBJECT");
                        return null;
                    }

                    // Parse the response and check for records
                    var responseString = await response.Content.ReadAsStringAsync();
                    var result = JObject.Parse(responseString);

                    var records = result["result"]?["records"] as JArray;
                    if (records == null || !records.Any())
                    {
                        // Exit the loop if there are no more records
                        break;
                    }

                    // Add the fetched records to the JArray
                    allRecords.Merge(records);

                    // Increment the offset for the next batch
                    offset += limit;
                }

                // Create a JObject to hold the final result
                var finalResult = new JObject
                {
                    ["result"] = new JObject
                    {
                        ["records"] = allRecords // Add all the accumulated records
                    }
                };

                return finalResult; // Return the accumulated records wrapped in a JObject
            }
            catch (Exception e)
            {
                Console.WriteLine($"An error occurred: {e.Message}");
                return null;
            }
        }

        private async Task<JObject?> GetCCADetails3(HttpClient httpClient, string school, string fields)
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

        private async Task<JObject?> GetSubjectDetails2(HttpClient httpClient, string school, string fields) 
        {
            var limit = 100; // Set a reasonable batch size
            var offset = 0;  // Start with the first batch
            var allRecords = new JArray(); // JArray to store all the records

            try
            {
                while (true)
                {
                    // Prepare the API URL with pagination parameters
                    var externalAPI = $"https://data.gov.sg/api/action/datastore_search?resource_id=d_f1d144e423570c9d84dbc5102c2e664d&fields={fields}&q={school}&limit={limit}&offset={offset}";       

                    // Make the API request
                    var response = await httpClient.GetAsync(externalAPI);
                    if (!response.IsSuccessStatusCode)
                    {
                        Console.WriteLine("ERROR CALLING EXTERNAL API FOR SUBJECT");
                        return null;
                    }

                    // Parse the response and check for records
                    var responseString = await response.Content.ReadAsStringAsync();
                    var result = JObject.Parse(responseString);

                    var records = result["result"]?["records"] as JArray;
                    if (records == null || !records.Any())
                    {
                        // Exit the loop if there are no more records
                        break;
                    }

                    // Add the fetched records to the JArray
                    allRecords.Merge(records);

                    // Increment the offset for the next batch
                    offset += limit;
                }

                // Create a JObject to hold the final result
                var finalResult = new JObject
                {
                    ["result"] = new JObject
                    {
                        ["records"] = allRecords // Add all the accumulated records
                    }
                };

                return finalResult; // Return the accumulated records wrapped in a JObject
            }
            catch (Exception e)
            {
                Console.WriteLine($"An error occurred: {e.Message}");
                return null;
            }
        }

        private async Task<JObject?> GetSubjectDetails3(HttpClient httpClient, string school, string fields)
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
