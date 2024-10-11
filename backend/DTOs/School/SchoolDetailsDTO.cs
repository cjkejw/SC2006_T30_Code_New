using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.School
{
    public class SchoolDetailsDTO
    {
        public string Address { get; set; } = string.Empty;
        public string ZoneCode { get; set; } = string.Empty;
        public string TelephoneNo { get; set; } = string.Empty;
        public string NatureCode { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
         public string UrlAddress { get; set; } = string.Empty;
    }
}