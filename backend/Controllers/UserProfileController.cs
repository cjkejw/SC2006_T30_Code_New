using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs.Account;
using backend.Mappers;
using backend.Interface;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.DTOs.UserProfile;
using backend.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.Controllers
{
     [Route("backend/userprofile")]
     [ApiController]
     public class UserProfileController : ControllerBase
     {
         private readonly IUserProfileRepository _userProfileRepository;
         private readonly UserManager<WebUser> _userManager;

         public UserProfileController(IUserProfileRepository userProfileRepository, UserManager<WebUser> userManager)
         {
             _userProfileRepository = userProfileRepository;
             _userManager = userManager;
         }

        [Authorize] // Ensure the user is authenticated
        [HttpPost("create")]
        public async Task<IActionResult> CreateUserProfile([FromBody] CreateUserProfileRequestDTO userProfileDTO)
        {
            if (userProfileDTO == null)
            {
                return BadRequest("User Profile DTO missing.");
            }

             // Get the user's email from the JWT claims
            var userEmailClaim = User.FindFirst(ClaimTypes.Email)?.Value; // Adjust claim type if needed

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

            var userProfileModel = userProfileDTO.ToUserProfileFromCreateDTO(user.Id);
            await _userProfileRepository.CreateUserProfileAsync(userProfileModel);
            return CreatedAtAction(nameof(GetById), new { id = userProfileModel.ProfileId }, userProfileModel.ToUserProfileDTO());
        }

        //Tempt search method until we can link it to the user id
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var userProfile = await _userProfileRepository.GetUserProfileByIdAsync(id);
            if(userProfile == null){
                return NotFound();
            }
            return Ok(userProfile);
        }

        [Authorize] // Ensure the user is authenticated
        [HttpGet("me")]
        public async Task<IActionResult> GetOrCreateUserProfile()
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

            // Fetch the user's profile using the userId
            var userProfile = await _userProfileRepository.GetUserProfileByUserIdAsync(user.Id);

            if (userProfile == null)
            {
                // Profile does not exist, create a new one
                var newUserProfile = new UserProfile
                {
                    UserId = user.Id,
                    EducationLevel = "Not Specified",
                    Location = "Not Specified",
                    SubjectInterests = "Not Specified",
                    DistinctiveProgram = "Not Specified",
                    CCA = "Not Specified"
                };

                await _userProfileRepository.CreateUserProfileAsync(newUserProfile);

                // Map to DTO and return the newly created profile
                var newUserProfileDTO = newUserProfile.ToUserProfileDTO();
                return Ok(newUserProfileDTO);
            }

            // If profile exists, return it
            var userProfileDTO = userProfile.ToUserProfileDTO();
            return Ok(userProfileDTO);
        }


        // PUT: api/userprofile/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserProfile([FromRoute] int id, [FromBody] UpdateUserProfileRequestDTO updateDTO)
        {
           var userProfile = await _userProfileRepository.UpdateUserProfileAsync(id, updateDTO);
           if (userProfile == null)
           {
               return NotFound();
           }
           return Ok(userProfile);
        }
    }
}
