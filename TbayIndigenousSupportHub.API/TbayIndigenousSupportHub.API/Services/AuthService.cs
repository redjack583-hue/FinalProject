using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TbayIndigenousSupportHub.API.Data;
using TbayIndigenousSupportHub.API.DTOs;
using TbayIndigenousSupportHub.API.Models;
using TbayIndigenousSupportHub.API.Interfaces;

namespace TbayIndigenousSupportHub.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly EmailService _emailService;

        public AuthService(ApplicationDbContext context, IConfiguration configuration, EmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        public async Task<ApiResponse<string>> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == request.Email);
            if (user == null) return ApiResponse<string>.ErrorResponse("User not found.");

            var passwordHasher = new PasswordHasher<User>();
            var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash!, request.Password);
            if (result == PasswordVerificationResult.Failed) return ApiResponse<string>.ErrorResponse("Invalid password.");

            await InvalidateOldOtps(request.Email);
            var otpCode = await GenerateAndSendOtp(request.Email);

            return ApiResponse<string>.SuccessResponse(null!, "OTP sent successfully.");
        }

        public async Task<ApiResponse<string>> RegisterAsync(RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(x => x.Email == request.Email))
                return ApiResponse<string>.ErrorResponse("User already exists.");

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                Role = request.Role ?? "User",
                CreatedAt = DateTime.UtcNow,
                IsActive = false
            };

            var passwordHasher = new PasswordHasher<User>();
            user.PasswordHash = passwordHasher.HashPassword(user, request.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            await GenerateAndSendOtp(request.Email);

            return ApiResponse<string>.SuccessResponse(null!, "Registration successful. OTP sent for verification.");
        }

        public async Task<ApiResponse<object>> VerifyOtpAsync(VerifyOtpRequest request)
        {
            var otpRecord = await _context.OTPRequests
                .Where(x => x.Email == request.Email &&
                            x.OTPCode == request.Otp &&
                            !x.IsUsed &&
                            x.ExpiryTime > DateTime.UtcNow)
                .FirstOrDefaultAsync();

            if (otpRecord == null) return ApiResponse<object>.ErrorResponse("Invalid or expired OTP.");

            otpRecord.IsUsed = true;
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == request.Email);
            if (user != null && !user.IsActive) user.IsActive = true;

            await _context.SaveChangesAsync();
            var token = GenerateJwtToken(user!);

            return ApiResponse<object>.SuccessResponse(new { token });
        }

        private async Task InvalidateOldOtps(string email)
        {
            var oldOtps = await _context.OTPRequests
                .Where(x => x.Email == email && !x.IsUsed)
                .ToListAsync();

            foreach (var otp in oldOtps) otp.IsUsed = true;
            await _context.SaveChangesAsync();
        }

        private async Task<string> GenerateAndSendOtp(string email)
        {
            var random = new Random();
            var otpCode = random.Next(100000, 999999).ToString();

            var otpRequest = new OTPRequest
            {
                Email = email,
                OTPCode = otpCode,
                CreatedAt = DateTime.UtcNow,
                ExpiryTime = DateTime.UtcNow.AddMinutes(5),
                IsUsed = false
            };

            _context.OTPRequests.Add(otpRequest);
            await _context.SaveChangesAsync();

            _emailService.SendOtpEmail(email, otpCode);
            return otpCode;
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Email!),
                new Claim(ClaimTypes.Role, user.Role!)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(int.Parse(jwtSettings["DurationInMinutes"]!)),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
