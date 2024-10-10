using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Comment
    {
        [Key]
        public int CommentId { get; set; }

        public string? PostId { get; set; }
        public Post? Post { get; set; } 

        // public int? UserId { get; set; }
        // public WebUser? User { get; set; }  
        
        public string CommentContent { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}