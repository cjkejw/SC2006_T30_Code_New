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
        Task<UserProfile> CreateUserProfileAsync(UserProfile userProfileModel);
        Task<UserProfile?> GetUserProfileByIdAsync(int id);
        Task<UserProfile?> GetUserProfileByUserIdAsync(string userId);
        Task<UserProfile?> UpdateUserProfileAsync(int id, UpdateUserProfileRequestDTO updateDTO);
    }
}
