using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using backend.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace backend.Repository
{
    // public class UserProfileRepository : IUserProfileRepository
    // {
    //     private readonly ApplicationDBContext _context;

    //     public UserProfileRepository(ApplicationDBContext context)
    //     {
    //         _context = context;
    //     }

    //     // Generate UserProfile for a new User
    //     public async Task<UserProfile> CreateUserProfile(WebUser user)
    //     {
    //         var userProfile = new UserProfile
    //         {
    //             UserId = user.UserId,
    //             User = user,
    //             EducationLevel = "Not specified",  // Default values or empty
    //             Location = "Not specified",
    //             SubjectInterests = "Not specified",
    //             DistinctiveProgram = "Not specified",
    //             CCA = "Not specified"
    //         };

    //         _context.UserProfile.Add(userProfile);
    //         await _context.SaveChangesAsync(); // Save changes to the database

    //         return userProfile;
    //     }

    //     public async Task<UserProfile> GetUserProfile(WebUser user)
    //     {
    //         return await _context.UserProfile.FirstOrDefaultAsync(u => u.UserId == user.UserId);
    //     }

    //     public async Task<UserProfile> UpdateUserProfile(int profileID, string educationLevel, string location, string cca, string subjectInterests, string distinctiveProgram)
    //     {
    //         var existingProfile = await _context.UserProfile.FirstOrDefaultAsync(u => u.ProfileId == profileID);

    //         if (existingProfile == null)
    //         {
    //             return null; // Profile not found
    //         }

    //         // Update fields
    //         existingProfile.EducationLevel = educationLevel;
    //         existingProfile.Location = location;
    //         existingProfile.CCA = cca;
    //         existingProfile.SubjectInterests = subjectInterests;
    //         existingProfile.DistinctiveProgram = distinctiveProgram;

    //         await _context.SaveChangesAsync(); // Save changes to the database
    //         return existingProfile;  // Return the updated profile
    //     }

    // }
}
