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
    [Route("/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<WebUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<WebUser> _signinManager;
        public AccountController(UserManager<WebUser> userManager, ITokenService tokenService, SignInManager<WebUser> signInManager)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signinManager = signInManager;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == loginDTO.Email.ToLower());
            if(user == null){
                return Unauthorized("Invalid Username!");
            }
            var result = await _signinManager.CheckPasswordSignInAsync(user, loginDTO.Password, false);

            if (!result.Succeeded) return Unauthorized("Username not found and/or incorrect password!");
            return Ok(
                new NewUserDTO
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Token = await _tokenService.CreateToken(user)
                }
            );
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDTO r)
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
                    Console.WriteLine($"Role assignment success: {roleResult.Succeeded}");
                    if(roleResult.Succeeded)
                    {
                        return Ok();
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