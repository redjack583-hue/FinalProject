namespace TbayIndigenousSupportHub.API.Models
{
    public class OTPRequest
    {
        public int OTPRequestId { get; set; }   // PRIMARY KEY

        public string? Email { get; set; }

        public string? OTPCode { get; set; }

        public DateTime ExpiryTime { get; set; }

        public bool IsUsed { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
