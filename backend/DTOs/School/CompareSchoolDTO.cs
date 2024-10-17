using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.School
{
    public class CompareSchoolDTO
    {
        public string Zone { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public List<string> Subjects { get; set; } = new List<string>();
        public List<string> Programmes { get; set; } = new List<string>();
        public List<string> CCA { get; set; } = new List<string>();
    }
}