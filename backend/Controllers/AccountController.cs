using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs.Account;
using backend.Mappers;
using backend.Interface;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Dtos.Account;

namespace backend.Controllers
{
    [Route("backend/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<WebUser> _userManager;
        private readonly ITokenService _tokenService;
        public AccountController(UserManager<WebUser> userManager, ITokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegisterUserDTO r)
        {
            try
            {
                if(!ModelState.IsValid)
                {
                    Console.WriteLine("ModelState");
                    return StatusCode(500, ModelState);
                }

                if (r.Password != r.ConfirmPassword)
                {
                    return StatusCode(500,"The password and confirmation password do not match.");
                }
                var webUser = r.ToWebUserFromRegisterDTO();

                var createdUser = await _userManager.CreateAsync(webUser, r.Password);

                if(createdUser.Succeeded)
                {
                    // assign role
                    var roleResult = await _userManager.AddToRoleAsync(webUser, "User");
                    if(roleResult.Succeeded)
                    {
                        return Ok(
                            new NewUserDTO
                            {
                                FirstName = webUser.FirstName,
                                LastName = webUser.LastName,
                                Email = webUser.Email,
                                Token = _tokenService.CreateToken(webUser)
                            }
                        );
                    }
                    // error while assigning role
                    else
                    {
                        Console.WriteLine("Role");
                        return StatusCode(500, roleResult.Errors);
                    }
                }
                // error while creating user
                else
                {
                    Console.WriteLine("user");
                    return StatusCode(500, createdUser.Errors);
                }
            }
            // any other type of errors regarding identity package
            catch(Exception e)
            {
                Console.WriteLine("others");
                return StatusCode(500, e);
            }
        }
    }
}