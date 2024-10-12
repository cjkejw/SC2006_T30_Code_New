using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.Comment
{
    public class CreateCommentDTO
    {   
        public string CommentContent { get; set; } = string.Empty;
        
    }
}