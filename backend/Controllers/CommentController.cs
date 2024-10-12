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
using backend.DTOs.Comment;
using backend.DTOs.Post;
using backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Client;

namespace backend.Controllers
{
    [Route("/comment")]
    [ApiController]
    public class CommentController : ControllerBase{
        private readonly ApplicationDBContext _context;
        private readonly ICommentRepository _commentRepo;

        private readonly IPostRepository _postRepo;
        public CommentController(ApplicationDBContext context, ICommentRepository commentRepo, IPostRepository postRepo)
        {
            _commentRepo = commentRepo;
            _context = context;
            _postRepo = postRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var comments = await _commentRepo.GetAllAsync();

            var commentDTO = comments.Select(x => x.ToCommentDTO ());
            return Ok(commentDTO);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var comment = await _commentRepo.GetByIdAsync(id);

            if (comment == null)
            {
                return NotFound();
            }

            return Ok(comment.ToCommentDTO());
        }

        [HttpPost("{postId}")]
        public async Task<IActionResult> Create([FromRoute] int postId, CreateCommentDTO commentDTO){
            if (!await _postRepo.PostExists(postId)){
                return BadRequest("Post does not exist");
            }
            var commentModel = commentDTO.ToCommentFromCreate(postId);
            await _commentRepo.CreateAsync(commentModel);

            return CreatedAtAction(nameof(GetById), new {id = commentModel.CommentId}, commentModel.ToCommentDTO());
        }
    }
    
}