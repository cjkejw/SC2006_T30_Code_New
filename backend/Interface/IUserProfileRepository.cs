using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using backend.DTOs.UserProfile;

namespace backend.Interface
{
    public interface IUserProfileRepository
    {
        Task<UserProfile> CreateAsync(UserProfile userProfileModel);
        Task<UserProfile?> GetByIdAsync(int id);
         //Task<UserProfile> GetUserProfile(WebUser user);
        Task<UserProfile?> UpdateAsync(int id, UpdateUserProfileRequestDTO updateDTO);
    }
}
