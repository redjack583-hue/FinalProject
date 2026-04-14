using TbayIndigenousSupportHub.API.Models;

namespace TbayIndigenousSupportHub.API.Interfaces
{
    public interface IHubService
    {
        Task<IEnumerable<Service>> GetAllServicesAsync();
        Task<Service?> GetServiceByIdAsync(int id);
        Task<Service> CreateServiceAsync(Service service);
        Task UpdateServiceAsync(Service service);
        Task DeleteServiceAsync(int id);

        // Filter Options
        Task<IEnumerable<FilterOption>> GetFilterOptionsAsync();
        Task<FilterOption> CreateFilterOptionAsync(FilterOption option);
        Task UpdateFilterOptionAsync(FilterOption option);
        Task DeleteFilterOptionAsync(int id);
    }
}
