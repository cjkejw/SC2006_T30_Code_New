using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using backend.DTOs.Comment;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Mappers
{
    public static class Commentappers
    {
        public static CommentDTO ToCommentDTO(this Comment commentModel){
            return new CommentDTO
            {
                CommentId = commentModel.CommentId,
                CommentContent = commentModel.CommentContent,
                CreatedAt = commentModel.CreatedAt,
                PostId = commentModel.PostId,
            };
        }

         public static Comment ToCommentFromCreate(this CreateCommentDTO commentDTO, int postId){
            return new Comment
            {
                CommentContent = commentDTO.CommentContent,
                PostId = postId,
            };
        }

        
    }
}