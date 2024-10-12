using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using backend.Interface;
using backend.DTOs.Post;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace backend.Repository
{
    public class PostRepository : IPostRepository
    {
         private readonly ApplicationDBContext _context;
        public PostRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Post> CreateAsync(Post postModel)
        {
            await _context.Posts.AddAsync(postModel);
            await _context.SaveChangesAsync();
            return postModel;
        }

        public async Task<Post?> DeleteAsync(int id)
        {
            var stockModel = await _context.Posts.FirstOrDefaultAsync(x => x.PostId == id);

            if (stockModel == null)
            {
                return null;
            }

            _context.Posts.Remove(stockModel);
            await _context.SaveChangesAsync();
            return stockModel;
        }

         public async Task<Post?> UpdateAsync(int id, UpdatePostRequestDTO postDTO)
        {
            var existingPost = await _context.Posts.FirstOrDefaultAsync(x => x.PostId == id);

            if (existingPost == null)
            {
                return null;
            }

            existingPost.Title = postDTO.Title;
            existingPost.Content = postDTO.Content;

            await _context.SaveChangesAsync();

            return existingPost;
        }

        public async Task<Post?> GetByIdAsync(int id)
        {
            return await _context.Posts.FirstOrDefaultAsync(i => i.PostId == id);
        }

        public Task<List<Post>> GetAllAsync()
        {
           return _context.Posts.ToListAsync();
        }
    }
    
}