﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using backend.DTOs.Post;

namespace backend.Interface
{
    public interface IPostRepository
    {
        Task<List<Post>> GetAllAsync();
        Task<Post?> GetByIdAsync(int id);
        Task<Post> CreateAsync(Post postModel);
        Task<Post?> UpdateAsync(int id, UpdatePostRequestDTO postDTO);
        Task<Post?> DeleteAsync(int id);

        Task<IEnumerable<Post>> GetPostsByUserIdAsync(string userId);

        Task<List<WebUser>> GetAllUserPostAsync();
        //Task<List<Post>> GetUserPostsAsync(string userId);
        Task<bool> PostExists(int id);
    }
}
