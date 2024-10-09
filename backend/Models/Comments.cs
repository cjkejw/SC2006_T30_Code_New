using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Comments
    {
        [Key]
        public int CommentId { get; set; }

        public int? PostId { get; set; }
        public Posts? Posts { get; set; } 

        public int? UserId { get; set; }
        public User? User { get; set; }  
        
        public string CommentContent { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}