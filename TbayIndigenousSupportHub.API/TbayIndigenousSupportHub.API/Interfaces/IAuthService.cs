using TbayIndigenousSupportHub.API.Models;
using TbayIndigenousSupportHub.API.DTOs;

namespace TbayIndigenousSupportHub.API.Interfaces
{
    public interface IAuthService
    {
        Task<ApiResponse<string>> LoginAsync(LoginRequest request);
        Task<ApiResponse<string>> RegisterAsync(RegisterRequest request);
        Task<ApiResponse<object>> VerifyOtpAsync(VerifyOtpRequest request);
    }
}
