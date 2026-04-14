using Microsoft.AspNetCore.Mvc;
using TbayIndigenousSupportHub.API.Models;
using Microsoft.AspNetCore.Authorization;
using TbayIndigenousSupportHub.API.DTOs;
using TbayIndigenousSupportHub.API.Interfaces;

namespace TbayIndigenousSupportHub.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<UserResponseDto>>>> GetUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(ApiResponse<IEnumerable<UserResponseDto>>.SuccessResponse(users));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<User>>> GetUser(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null) 
                return NotFound(ApiResponse<User>.ErrorResponse("User not found."));

            return Ok(ApiResponse<User>.SuccessResponse(user));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<User>>> CreateUser(User user)
        {
            var createdUser = await _userService.CreateUserAsync(user);
            return CreatedAtAction(nameof(GetUser), 
                new { id = createdUser.UserId }, 
                ApiResponse<User>.SuccessResponse(createdUser, "User created successfully."));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<string>>> UpdateUser(int id, User updatedUser)
        {
            if (id != updatedUser.UserId) 
                return BadRequest(ApiResponse<string>.ErrorResponse("ID mismatch."));

            await _userService.UpdateUserAsync(id, updatedUser);
            return Ok(ApiResponse<string>.SuccessResponse("User updated successfully."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<string>>> DeleteUser(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null) 
                return NotFound(ApiResponse<string>.ErrorResponse("User not found."));

            await _userService.DeleteUserAsync(id);
            return Ok(ApiResponse<string>.SuccessResponse("User deleted successfully."));
        }
    }
}
