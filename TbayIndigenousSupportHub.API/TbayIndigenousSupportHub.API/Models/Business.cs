namespace TbayIndigenousSupportHub.API.Models
{
    public class Business
    {

        public int BusinessId { get; set; }
        public string? BusinessName { get; set; }
        public string? Description { get; set; }
        public string? Category { get; set; }
        public int OwnerUserId { get; set; }

        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }

        public bool IsVerified { get; set; }
        public DateTime CreatedAt { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }





    }
}
