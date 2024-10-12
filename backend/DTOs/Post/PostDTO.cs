using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs.Comment;

namespace backend.DTOs.Post
{
    public class PostDTO
    {
        public int PostId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Content { get; set; }= string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public List<CommentDTO> Comments { get; set; }
        
    }
}