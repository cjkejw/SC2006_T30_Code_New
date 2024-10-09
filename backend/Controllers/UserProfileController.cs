using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Interface;

namespace backend.Controllers
{
    [Route("backend/userprofile")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private readonly IUserProfileRepository _userProfileRepository;

        public UserProfileController(IUserProfileRepository userProfileRepository)
        {
            _userProfileRepository = userProfileRepository;
        }

        // POST: api/userprofile/create
        [HttpPost("create")]
        public async Task<IActionResult> CreateUserProfile([FromBody] WebUser user)
        {
            var userProfile = await _userProfileRepository.CreateUserProfile(user);
            if (userProfile != null)
            {
                return Ok(userProfile); // Return the created profile
            }
            return StatusCode(500, "Failed to create user profile.");
        }

        // GET: api/userprofile/{userId}
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserProfile(String userId)
        {
            var user = new WebUser { Id = userId };  // Creating a user object with the ID
            var userProfile = await _userProfileRepository.GetUserProfile(user);

            if (userProfile != null)
            {
                return Ok(userProfile); // Return the user profile
            }
            return NotFound("User profile not found.");
        }

        // PUT: api/userprofile/{profileID}
        [HttpPut("{profileID}")]
        public async Task<IActionResult> UpdateUserProfile(int profileID, [FromBody] UserProfile updatedProfile)
        {
            var userProfile = await _userProfileRepository.UpdateUserProfile(
                profileID,
                updatedProfile.EducationLevel,
                updatedProfile.Location,
                updatedProfile.CCA,
                updatedProfile.SubjectInterests,
                updatedProfile.DistinctiveProgram
            );

            if (userProfile != null)
            {
                return Ok(userProfile); // Return the updated profile
            }
            return NotFound("User profile not found or update failed.");
        }
    }

}
