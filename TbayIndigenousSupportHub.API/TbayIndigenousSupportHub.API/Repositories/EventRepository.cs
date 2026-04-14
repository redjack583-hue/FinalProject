using TbayIndigenousSupportHub.API.Data;
using TbayIndigenousSupportHub.API.Interfaces;
using TbayIndigenousSupportHub.API.Models;

namespace TbayIndigenousSupportHub.API.Repositories
{
    public class EventRepository : BaseRepository<Event>, IEventRepository
    {
        public EventRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
