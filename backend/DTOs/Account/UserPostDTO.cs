using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs.Post;

namespace backend.Dtos.Account
{
    public class UserPostDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public List<PostDTO> Posts { get; set; }


    }
}