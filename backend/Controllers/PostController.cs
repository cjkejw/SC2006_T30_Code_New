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
using backend.DTOs.Post;
using backend.Data;

namespace backend.Controllers
{
    [Route("backend/post")]
    [ApiController]
    public class PostController : ControllerBase{
        private readonly ApplicationDBContext _context;
        public PostController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll(){
            var posts = _context.Posts.ToList()
            .Select(s => s.ToPostDTO());
            return Ok(posts);
        }
    }
    
}