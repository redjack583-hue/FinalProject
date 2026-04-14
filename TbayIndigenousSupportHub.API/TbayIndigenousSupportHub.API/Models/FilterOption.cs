namespace TbayIndigenousSupportHub.API.Models
{
    public class FilterOption
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string FilterType { get; set; } = "Category"; // "Category" or "Type"
        public string EntityType { get; set; } = "Service"; // "Service" or "Business"
        public bool IsActive { get; set; } = true;
    }
}
