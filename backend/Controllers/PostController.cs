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

        [HttpGet("{id:int}")]
        public IActionResult GetById([FromRoute] int id)
        {

            var post = _context.Posts.Find(id);
            if(post == null){
                return NotFound();
            }
            return Ok(post);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreatePostRequestDTO postDTO)
        {
            var postModel = postDTO.ToPostFromCreateDTO();
            _context.Posts.Add(postModel);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = postModel.PostId }, postModel.ToPostDTO());
        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] UpdatePostRequestDTO updateDTO){
            var postModel = _context.Posts.FirstOrDefault(x => x.PostId == id);
            if(postModel == null){
                return NotFound();
            }

            postModel.Title = updateDTO.Title;
            postModel.Content = updateDTO.Content;
            _context.SaveChanges();
            return Ok(postModel);
        }
    }
    
}