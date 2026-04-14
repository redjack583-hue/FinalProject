namespace TbayIndigenousSupportHub.API.Models
{
    public class Service
    {

        public int ServiceId { get; set; }
        public string? ServiceName { get; set; }

        public string? Category { get; set; }
        public string? Description { get; set; }
        public string? Location { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Website { get; set; }

        public bool IsActive { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

    }
}
