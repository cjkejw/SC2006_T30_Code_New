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

        [HttpPost("create")]
        public async Task<IActionResult> CreateUserProfile([FromBody]  CreateUserProfileRequestDTO userProfileDTO)
        {
            var userProfileModel = userProfileDTO.ToUserProfileFromCreateDTO();
            await _userProfileRepository.CreateAsync(userProfileModel);
            return CreatedAtAction(nameof(GetById), new { id = userProfileModel.ProfileId }, userProfileModel.ToUserProfileDTO());
        }

        //Tempt search method until we can link it to the user id
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {

            var userProfile = await _userProfileRepository.GetByIdAsync(id);
            if(userProfile == null){
                return NotFound();
            }
            return Ok(userProfile);
        }

         // GET: api/userprofile/{userId}
         /* [HttpGet("{userId}")]
         public async Task<IActionResult> GetUserProfile(String userId)
         {
             var user = new WebUser { Id = userId };  // Creating a user object with the ID
             var userProfile = await _userProfileRepository.GetUserProfile(user);

             if (userProfile != null)
             {
                 return Ok(userProfile); // Return the user profile
             }
             return NotFound("User profile not found.");
         } */

         // PUT: api/userprofile/{profileID}
         [HttpPut("{profileID}")]
         public async Task<IActionResult> UpdateUserProfile([FromRoute] int id, [FromBody] UpdateUserProfileRequestDTO updateDTO)
         {
            var userProfile = await _userProfileRepository.UpdateAsync(id, updateDTO);
            if (userProfile == null)
            {
                return NotFound();
            }

            return Ok(userProfile);
         }
    }
}
