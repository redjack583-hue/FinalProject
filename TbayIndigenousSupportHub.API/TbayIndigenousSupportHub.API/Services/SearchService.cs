using TbayIndigenousSupportHub.API.Interfaces;
using TbayIndigenousSupportHub.API.Models;

namespace TbayIndigenousSupportHub.API.Services
{
    public class SearchService
    {
        private readonly IBusinessRepository _businessRepo;
        private readonly IEventRepository _eventRepo;
        private readonly IServiceRepository _serviceRepo;

        public SearchService(IBusinessRepository businessRepo, IEventRepository eventRepo, IServiceRepository serviceRepo)
        {
            _businessRepo = businessRepo;
            _eventRepo = eventRepo;
            _serviceRepo = serviceRepo;
        }

        public async Task<IEnumerable<Business>> SearchBusinessesAsync(string? query, string? category)
        {
            return await _businessRepo.FindAsync(b => 
                (string.IsNullOrEmpty(query) || (b.BusinessName != null && b.BusinessName.Contains(query)) || (b.Description != null && b.Description.Contains(query))) &&
                (string.IsNullOrEmpty(category) || b.Category == category)
            );
        }

        public async Task<IEnumerable<Event>> SearchEventsAsync(string? query, string? type)
        {
            return await _eventRepo.FindAsync(e => 
                (string.IsNullOrEmpty(query) || (e.EventTitle != null && e.EventTitle.Contains(query)) || (e.Description != null && e.Description.Contains(query))) &&
                (string.IsNullOrEmpty(type) || e.EventType == type)
            );
        }

        public async Task<IEnumerable<Service>> SearchServicesAsync(string? query, string? category)
        {
            return await _serviceRepo.FindAsync(s => 
                (string.IsNullOrEmpty(query) || (s.ServiceName != null && s.ServiceName.Contains(query)) || (s.Description != null && s.Description.Contains(query))) &&
                (string.IsNullOrEmpty(category) || s.Category == category)
            );
        }
    }
}
