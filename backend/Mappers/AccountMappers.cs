using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Account;
using backend.DTOs.Account;
using backend.DTOs.Post;
using backend.Models;

namespace backend.Mappers
{
    public static class AccountMappers
    {
        public static WebUser ToWebUserFromRegisterDTO(this RegisterUserDTO r)
        {
            return new WebUser
            {
                UserName = r.Email,
                FirstName = r.FirstName,
                LastName = r.LastName,
                Email = r.Email
            };
        }

        public static UserPostDTO ToUserPostDTO(this WebUser userModel){
            return new UserPostDTO
            {
                FirstName = userModel.FirstName,
                LastName = userModel.LastName,
                Email = userModel.Email,
                Posts = userModel.Posts.Select(p => p.ToPostDTO()).ToList()
            };
        }
    }
}