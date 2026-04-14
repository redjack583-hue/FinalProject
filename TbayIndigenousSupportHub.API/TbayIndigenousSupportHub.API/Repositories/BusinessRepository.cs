using TbayIndigenousSupportHub.API.Data;
using TbayIndigenousSupportHub.API.Interfaces;
using TbayIndigenousSupportHub.API.Models;

namespace TbayIndigenousSupportHub.API.Repositories
{
    public class BusinessRepository : BaseRepository<Business>, IBusinessRepository
    {
        public BusinessRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
