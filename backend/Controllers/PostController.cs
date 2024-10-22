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
using backend.DTOs.Account;
using backend.DTOs.Comment;
using backend.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System;
using backend.Dtos.Account;

namespace backend.Controllers
{
    [Route("/post")]
    [ApiController]
    public class PostController : ControllerBase{
        private readonly ApplicationDBContext _context;
        private readonly IPostRepository _postRepo;
        private readonly UserManager<WebUser> _userManager;
        public PostController(ApplicationDBContext context, IPostRepository postRepo, UserManager<WebUser> userManager)
        {
            _postRepo = postRepo;
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("postswithcreatordetails")]
        public async Task<IActionResult> GetAllUserPost(){
            var postsWithUserInfo = await _context.Posts
            .Include(p => p.User) // Assuming you have a navigation property for User
            .Select(post => new UserPostDTO
            {
                FirstName = post.User.FirstName,
                LastName = post.User.LastName,
                Email = post.User.Email,
                Posts = new List<PostDTO>
                {
                    new PostDTO
                    {
                        PostId = post.PostId,
                        UserId = post.UserId,
                        Title = post.Title,
                        Content = post.Content,
                        CreatedAt = post.CreatedAt,
                        IsFlagged = post.IsFlagged,
                        Comments = post.Comments.Select(comment => new CommentDTO
                        {
                            CommentId = comment.CommentId,
                            //UserId = comment.UserId,
                            PostId = comment.PostId,
                            CommentContent = comment.CommentContent,
                            CreatedAt = comment.CreatedAt
                        }).ToList()
                    }
                }
            }).ToListAsync();
            return Ok(postsWithUserInfo);
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

        [HttpGet("my-posts")]
        [Authorize] 
        public async Task<IActionResult> GetMyPosts()
        {
            var userEmailClaim = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userEmailClaim))
            {
                return Unauthorized("User not authenticated.");
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email.ToLower() == userEmailClaim.ToLower());

            if (user == null)
            {
                return Unauthorized("User not found.");
            }

            var userId = user.Id;

            var posts = await _postRepo.GetPostsByUserIdAsync(userId);

            if (posts == null || !posts.Any())
            {
                return NotFound("No posts found for this user.");
            }

            var result = posts.Select(post => new
            {
                post.PostId,
                post.Title,
                post.Content,
                post.CreatedAt,
                post.IsFlagged,
                User = new
                {
                    user.FirstName,
                    user.LastName,
                    user.Email
                }
            });

            return Ok(result); 
        }

        [HttpPost]
        [Authorize] 
        public async Task<IActionResult> Create([FromBody] CreatePostRequestDTO postDTO)
        {
            if (postDTO == null || string.IsNullOrEmpty(postDTO.Title) || string.IsNullOrEmpty(postDTO.Content))
            {
                return BadRequest("Post title and content are required.");
            }

            // Get the user's email from the JWT claims
            var userEmailClaim = User.FindFirst(ClaimTypes.Email)?.Value; // Adjust claim type if needed

            if (string.IsNullOrEmpty(userEmailClaim))
            {
                return Unauthorized("User not authenticated.");
            }

            // Retrieve the user from the database using the email
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email.ToLower() == userEmailClaim.ToLower());

            if (user == null)
            {
                return Unauthorized("User not found.");
            }

            var postModel = new Post
            {
                UserId = user.Id, 
                Title = postDTO.Title,
                Content = postDTO.Content,
                CreatedAt = DateTime.Now,
                IsFlagged = false 
            };

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

        [HttpPost("{id:int}/report")]
        [Authorize] 
        public async Task<IActionResult> ReportPost([FromRoute] int id, [FromBody] ReportPostRequestDTO reportDTO)
        {
            // Validate the report DTO
            if (reportDTO == null || string.IsNullOrEmpty(reportDTO.Reason))
            {
                return BadRequest("Reason for reporting is required.");
            }

            // Find the post by id
            var post = await _postRepo.GetByIdAsync(id);
            if (post == null)
            {
                return NotFound("Post not found.");
            }

            post.IsFlagged = true;
            post.ReportReason = reportDTO.Reason;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Post has been reported.",
                postId = post.PostId,
                isFlagged = post.IsFlagged,
                reportReason = post.ReportReason
            });
        }

        [HttpGet("flaggedposts")]
        public async Task<IActionResult> GetFlaggedPosts()
        {
            var flaggedPosts = await _context.Posts
                .Where(p => p.IsFlagged)
                .Include(p => p.User)
                .Select(post => new UserPostDTO
                {
                    FirstName = post.User.FirstName,
                    LastName = post.User.LastName,
                    Email = post.User.Email,
                    Posts = new List<PostDTO>
                    {
                        new PostDTO
                        {
                            PostId = post.PostId,
                            UserId = post.UserId,
                            Title = post.Title,
                            Content = post.Content,
                            CreatedAt = post.CreatedAt,
                            IsFlagged = post.IsFlagged,
                            ReportReason = post.ReportReason, 
                            Comments = post.Comments.Select(comment => new CommentDTO
                            {
                                CommentId = comment.CommentId,
                                PostId = comment.PostId,
                                CommentContent = comment.CommentContent,
                                CreatedAt = comment.CreatedAt
                            }).ToList()
                        }
                    }
                })
                .ToListAsync();

            if (!flaggedPosts.Any())
            {
                return NotFound("No flagged posts found.");
            }

            return Ok(flaggedPosts);
        }
    }
    
}