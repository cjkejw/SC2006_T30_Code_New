using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.UserProfile
{
    public class UpdateUserProfileRequestDTO
    {
        public string EducationLevel { get; set; } = string.Empty;

        public string Location { get; set; }= string.Empty;
        
        public string SubjectInterests { get; set; }= string.Empty;
        
        public string DistinctiveProgram { get; set; }= string.Empty;
        
        public string CCA { get; set; }= string.Empty;
    }
}