using TbayIndigenousSupportHub.API.Models;
using TbayIndigenousSupportHub.API.DTOs;

namespace TbayIndigenousSupportHub.API.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(int id);
        Task<User> CreateUserAsync(User user);
        Task UpdateUserAsync(int id, User updatedUser);
        Task DeleteUserAsync(int id);
    }
}
