namespace TbayIndigenousSupportHub.API.Models
{
    public class Event
    {
        public int EventId { get; set; }
        public string? EventTitle { get; set; }

        public string? EventType { get; set; }
        public string? Description { get; set; }
        public DateTime EventDate { get; set; }
        public string? Location { get; set; }
        public string? Address { get; set; }
        public DateTime CreatedAt { get; set; }


    }
}
