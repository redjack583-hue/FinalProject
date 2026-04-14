using TbayIndigenousSupportHub.API.Models;

namespace TbayIndigenousSupportHub.API.Interfaces
{
    public interface IBusinessService
    {
        Task<IEnumerable<Business>> GetAllBusinessesAsync();
        Task<Business?> GetBusinessByIdAsync(int id);
        Task<Business> CreateBusinessAsync(Business business);
        Task UpdateBusinessAsync(Business business);
        Task DeleteBusinessAsync(int id);
    }
}
