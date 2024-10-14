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
                DistinctiveProgram = userProfileModel.DistinctiveProgram,
                CCA = userProfileModel.CCA
            };
        }

        public static UserProfile ToPostFromCreateDTO()
        {
            return new UserProfile
            {
                EducationLevel = "Not specified",  // Default values or empty
                Location = "Not specified",
                SubjectInterests = "Not specified",
                DistinctiveProgram = "Not specified",
                CCA = "Not specified"
            };
        } 
    }
}