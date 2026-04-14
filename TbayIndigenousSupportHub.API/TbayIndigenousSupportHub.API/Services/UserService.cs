using Microsoft.AspNetCore.Identity;
using TbayIndigenousSupportHub.API.Interfaces;
using TbayIndigenousSupportHub.API.Models;
using TbayIndigenousSupportHub.API.DTOs;

namespace TbayIndigenousSupportHub.API.Services
{
    public class UserService : IUserService
    {
        private readonly IBaseRepository<User> _repository;

        public UserService(IBaseRepository<User> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
        {
            var users = await _repository.GetAllAsync();
            return users.Select(u => new UserResponseDto
            {
                UserId = u.UserId,
                FullName = u.FullName,
                Email = u.Email,
                Role = u.Role,
                IsActive = u.IsActive
            });
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<User> CreateUserAsync(User user)
        {
            var passwordHasher = new PasswordHasher<User>();
            user.PasswordHash = passwordHasher.HashPassword(user, user.PasswordHash!);
            user.CreatedAt = DateTime.UtcNow;
            user.IsActive = true;
            await _repository.AddAsync(user);
            await _repository.SaveChangesAsync();
            return user;
        }

        public async Task UpdateUserAsync(int id, User updatedUser)
        {
            var user = await _repository.GetByIdAsync(id);
            if (user == null) return;

            if (!string.IsNullOrEmpty(updatedUser.FullName)) user.FullName = updatedUser.FullName;
            if (!string.IsNullOrEmpty(updatedUser.Email)) user.Email = updatedUser.Email;
            if (!string.IsNullOrEmpty(updatedUser.PasswordHash))
            {
                var passwordHasher = new PasswordHasher<User>();
                user.PasswordHash = passwordHasher.HashPassword(user, updatedUser.PasswordHash);
            }
            if (!string.IsNullOrEmpty(updatedUser.Role)) user.Role = updatedUser.Role;

            _repository.Update(user);
            await _repository.SaveChangesAsync();
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await _repository.GetByIdAsync(id);
            if (user != null)
            {
                _repository.Remove(user);
                await _repository.SaveChangesAsync();
            }
        }
    }
}
