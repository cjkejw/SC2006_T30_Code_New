using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using backend.Interface;
using backend.Models;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;

namespace backend.Service
{
    public class TokenService : ITokenService
    {
        private readonly UserManager<WebUser> _userManager;
        private readonly IConfiguration _config;
        private readonly SymmetricSecurityKey _key;

        public TokenService(UserManager<WebUser> userManager, IConfiguration config)
        {
            _userManager = userManager;
            _config = config;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:SigningKey"]));
        }
        public async Task<string> CreateToken(WebUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.GivenName, user.LastName),
                new Claim(JwtRegisteredClaimNames.FamilyName, user.FirstName)
            };
            var userRoles = await _userManager.GetRolesAsync(user);
            // Check if there are any roles and add the first one if it exists
            if (userRoles != null && userRoles.Count > 0)
            {
                claims.Add(new Claim(ClaimTypes.Role, userRoles[0])); 
            }           
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds,
                Issuer = _config["JWT:Issuer"],
                Audience = _config["JWT:Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}