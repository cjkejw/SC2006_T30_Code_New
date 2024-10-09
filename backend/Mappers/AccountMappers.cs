using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs.Account;
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
    }
}