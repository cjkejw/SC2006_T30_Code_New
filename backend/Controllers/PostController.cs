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
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("/post")]
    [ApiController]
    public class PostController : ControllerBase{
        private readonly ApplicationDBContext _context;
        private readonly IPostRepository _postRepo;
        public PostController(ApplicationDBContext context, IPostRepository postRepo)
        {
            _postRepo = postRepo;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(){
            var posts = await _postRepo.GetAllAsync();
            var postDTO = posts.Select(s => s.ToPostDTO());
            return Ok(posts);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {

            var post = await _postRepo.GetByIdAsync(id);
            if(post == null){
                return NotFound();
            }
            return Ok(post);
        }


        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePostRequestDTO postDTO)
        {
            var postModel = postDTO.ToPostFromCreateDTO();
            await _postRepo.CreateAsync(postModel);
            return CreatedAtAction(nameof(GetById), new { id = postModel.PostId }, postModel.ToPostDTO());
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdatePostRequestDTO updateDTO){
            var postModel = await _postRepo.UpdateAsync(id, updateDTO);
            if(postModel == null){
                return NotFound();
            }

            return Ok(postModel);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id){
            var postModel= await _postRepo.DeleteAsync(id);
            if(postModel == null){
                return NotFound();
            }
            return NoContent();
        }
    }
    
}