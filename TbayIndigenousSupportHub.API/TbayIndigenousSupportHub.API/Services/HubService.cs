using TbayIndigenousSupportHub.API.Interfaces;
using TbayIndigenousSupportHub.API.Models;

namespace TbayIndigenousSupportHub.API.Services
{
    public class HubService : IHubService
    {
        private readonly IServiceRepository _repository;
        private readonly IBaseRepository<FilterOption> _filterRepository;

        public HubService(IServiceRepository repository, IBaseRepository<FilterOption> filterRepository)
        {
            _repository = repository;
            _filterRepository = filterRepository;
        }

        public async Task<IEnumerable<Service>> GetAllServicesAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Service?> GetServiceByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Service> CreateServiceAsync(Service service)
        {
            await _repository.AddAsync(service);
            await _repository.SaveChangesAsync();
            return service;
        }

        public async Task UpdateServiceAsync(Service service)
        {
            _repository.Update(service);
            await _repository.SaveChangesAsync();
        }

        public async Task DeleteServiceAsync(int id)
        {
            var service = await _repository.GetByIdAsync(id);
            if (service != null)
            {
                _repository.Remove(service);
                await _repository.SaveChangesAsync();
            }
        }

        // Filter Options Implementation
        public async Task<IEnumerable<FilterOption>> GetFilterOptionsAsync()
        {
            return await _filterRepository.GetAllAsync();
        }

        public async Task<FilterOption> CreateFilterOptionAsync(FilterOption option)
        {
            await _filterRepository.AddAsync(option);
            await _filterRepository.SaveChangesAsync();
            return option;
        }

        public async Task UpdateFilterOptionAsync(FilterOption option)
        {
            _filterRepository.Update(option);
            await _filterRepository.SaveChangesAsync();
        }

        public async Task DeleteFilterOptionAsync(int id)
        {
            var option = await _filterRepository.GetByIdAsync(id);
            if (option != null)
            {
                _filterRepository.Remove(option);
                await _filterRepository.SaveChangesAsync();
            }
        }
    }
}
