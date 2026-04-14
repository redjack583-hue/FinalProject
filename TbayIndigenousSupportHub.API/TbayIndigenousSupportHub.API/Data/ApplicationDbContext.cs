using Microsoft.EntityFrameworkCore;
using TbayIndigenousSupportHub.API.Models;

namespace TbayIndigenousSupportHub.API.Data
{
    public class ApplicationDbContext : DbContext
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Business> Businesses { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<OTPRequest> OTPRequests { get; set; }
        public DbSet<FilterOption> FilterOptions { get; set; }
        
    }
}
