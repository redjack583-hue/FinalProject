using TbayIndigenousSupportHub.API.Interfaces;
using TbayIndigenousSupportHub.API.Models;

namespace TbayIndigenousSupportHub.API.Services
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _repository;

        public EventService(IEventRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Event>> GetAllEventsAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Event?> GetEventByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Event> CreateEventAsync(Event @event)
        {
            @event.CreatedAt = DateTime.UtcNow;
            await _repository.AddAsync(@event);
            await _repository.SaveChangesAsync();
            return @event;
        }

        public async Task UpdateEventAsync(Event @event)
        {
            _repository.Update(@event);
            await _repository.SaveChangesAsync();
        }

        public async Task DeleteEventAsync(int id)
        {
            var @event = await _repository.GetByIdAsync(id);
            if (@event != null)
            {
                _repository.Remove(@event);
                await _repository.SaveChangesAsync();
            }
        }
    }
}
