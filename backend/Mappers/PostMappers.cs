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
            };
        }

        public static Post ToPostFromCreateDTO(this CreatePostRequestDTO postDTO)
        {
            return new Post
            {
                Title = postDTO.Title,
                Content = postDTO.Content,
            };
        } 
    }
}