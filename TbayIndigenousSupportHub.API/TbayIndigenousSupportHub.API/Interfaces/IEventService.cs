using TbayIndigenousSupportHub.API.Models;

namespace TbayIndigenousSupportHub.API.Interfaces
{
    public interface IEventService
    {
        Task<IEnumerable<Event>> GetAllEventsAsync();
        Task<Event?> GetEventByIdAsync(int id);
        Task<Event> CreateEventAsync(Event @event);
        Task UpdateEventAsync(Event @event);
        Task DeleteEventAsync(int id);
    }
}
