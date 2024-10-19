using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using backend.Interface;
using backend.DTOs.UserProfile;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace backend.Repository
{
    public class UserProfileRepository : IUserProfileRepository
    {
        private readonly ApplicationDBContext _context;

        public UserProfileRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        //Get profile by profileid, still need to find a way to get via user id instead
        public async Task<UserProfile?> GetUserProfileByIdAsync(int id)
        {
            return await _context.UserProfile.FirstOrDefaultAsync(u => u.ProfileId == id);
        }

        // Generate UserProfile for a new User
        public async Task<UserProfile> CreateUserProfileAsync(UserProfile userProfileModel)
        {
            await _context.UserProfile.AddAsync(userProfileModel);
            await _context.SaveChangesAsync();

            return userProfileModel;
        }

        public async Task<UserProfile?> GetUserProfileByUserIdAsync(string userId)
        {
           return await _context.UserProfile.FirstOrDefaultAsync(u => u.UserId == userId);
        }

        public async Task<UserProfile?> UpdateUserProfileAsync(int id, UpdateUserProfileRequestDTO userProfileDTO)
        {
            var existingProfile = await _context.UserProfile.FirstOrDefaultAsync(u => u.ProfileId == id);

            if (existingProfile == null)
            {
                return null; // Profile not found
            }

            // Update fields
            existingProfile.EducationLevel = userProfileDTO.EducationLevel;
            existingProfile.Location = userProfileDTO.Location;
            existingProfile.CCA = userProfileDTO.CCA;
            existingProfile.SubjectInterests = userProfileDTO.SubjectInterests;
            existingProfile.DistinctiveProgram = userProfileDTO.DistinctiveProgram;

            await _context.SaveChangesAsync(); // Save changes to the database
            return existingProfile;  // Return the updated profile
        }
    }
}
