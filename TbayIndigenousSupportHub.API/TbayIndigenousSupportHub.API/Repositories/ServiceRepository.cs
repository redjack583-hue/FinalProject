using TbayIndigenousSupportHub.API.Data;
using TbayIndigenousSupportHub.API.Interfaces;
using TbayIndigenousSupportHub.API.Models;

namespace TbayIndigenousSupportHub.API.Repositories
{
    public class ServiceRepository : BaseRepository<Service>, IServiceRepository
    {
        public ServiceRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
