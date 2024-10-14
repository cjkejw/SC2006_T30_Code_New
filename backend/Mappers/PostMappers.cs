using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using backend.DTOs.Post;
using backend.Models;

namespace backend.Mappers
{
    public static class PostMappers
    {
        public static PostDTO ToPostDTO(this Post postModel){
            return new PostDTO
            {
                PostId = postModel.PostId,
                Title = postModel.Title,
                Content = postModel.Content,
                CreatedAt = postModel.CreatedAt,
                Comments = postModel.Comments.Select(c => c.ToCommentDTO()).ToList()
            };
        }

        public static Post ToPostFromCreateDTO(this CreatePostRequestDTO postDTO, string userId)
        {
            return new Post
            {
                //PostId = postDTO.PostId,
                Title = postDTO.Title,
                Content = postDTO.Content,
                UserId = userId,
            };
        }
        
         
    }
}