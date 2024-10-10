using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Post
    {
    [Key]
    public int PostId { get; set; }

    // public int? UserId { get; set; }
    // public WebUser? User { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Content { get; set; }= string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public bool IsFlagged { get; set; } = false;
    }
}