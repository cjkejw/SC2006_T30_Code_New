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
    public class CommentRepository : ICommentRepository
    {
        private readonly ApplicationDBContext _context;
        public CommentRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Comment> CreateAsync(Comment commnetModel)
        {
            commnetModel.CreatedAt = commnetModel.CreatedAt.ToUniversalTime();
            await _context.Comments.AddAsync(commnetModel);
            await _context.SaveChangesAsync();
            return commnetModel;
        }

        public async Task<List<Comment>> GetAllAsync(){
            return await _context.Comments.ToListAsync();
        }

        public async Task<Comment?> GetByIdAsync(int id)
        {
            return await _context.Comments.FirstOrDefaultAsync(c => c.CommentId == id);
        }
    }
    
}