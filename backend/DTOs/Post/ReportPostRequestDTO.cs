using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.Post
{
    public class ReportPostRequestDTO
    {
        [Required]
        public string Reason { get; set; } = string.Empty;
    }
}