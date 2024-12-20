using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class UserProfile
    {
        [Key]
        public int ProfileId { get; set; }

        public string? UserId { get; set; }
        public WebUser? User { get; set; }  

        public string EducationLevel { get; set; } = string.Empty;

        public string Location { get; set; }= string.Empty;
        
        public string SubjectInterests { get; set; }= string.Empty;
        
        public string CCA { get; set; }= string.Empty;
    }
}