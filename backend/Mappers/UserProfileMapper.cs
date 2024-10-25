using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using backend.DTOs.UserProfile;
using backend.Models;

namespace backend.Mappers
{
    public static class UserProfileMapper
    {
        public static UserProfileDTO ToUserProfileDTO(this UserProfile userProfileModel){
            return new UserProfileDTO
            {
                ProfileId = userProfileModel.ProfileId,
                EducationLevel = userProfileModel.EducationLevel,
                Location = userProfileModel.Location,
                SubjectInterests = userProfileModel.SubjectInterests,
                CCA = userProfileModel.CCA
            };
        }

        public static UserProfile ToUserProfileFromCreateDTO(this CreateUserProfileRequestDTO userProfileDTO, string userId)
        {
            return new UserProfile
            {
                UserId = userId,
                EducationLevel = "Not Specified",  // Default values or empty
                Location = "Not Specified",
                SubjectInterests = "Not Specified",
                CCA = "Not Specified"
            };
        } 
    }
}