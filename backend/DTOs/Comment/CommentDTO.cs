using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.Comment
{
    public class CommentDTO
    {
        public int CommentId { get; set; }

        public int? PostId { get; set; }
        
        public string CommentContent { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}

  
  
  
  