using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class AdminActions
    {
        [Key]
        public int ActionId { get; set; }

        // public int? AdminId { get; set; }
        // public WebUser? User { get; set; } 

        public int? PostId { get; set; }
        public Posts? Posts { get; set; }
        
        public string ActionType { get; set; } = string.Empty;
        
        public DateTime ActionTime { get; set; } = DateTime.Now;
    }
}

