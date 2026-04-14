using TbayIndigenousSupportHub.API.Interfaces;
using TbayIndigenousSupportHub.API.Models;

namespace TbayIndigenousSupportHub.API.Services
{
    public class BusinessService : IBusinessService
    {
        private readonly IBusinessRepository _repository;

        public BusinessService(IBusinessRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Business>> GetAllBusinessesAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Business?> GetBusinessByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Business> CreateBusinessAsync(Business business)
        {
            business.CreatedAt = DateTime.UtcNow;
            business.IsVerified = false;
            await _repository.AddAsync(business);
            await _repository.SaveChangesAsync();
            return business;
        }

        public async Task UpdateBusinessAsync(Business business)
        {
            _repository.Update(business);
            await _repository.SaveChangesAsync();
        }

        public async Task DeleteBusinessAsync(int id)
        {
            var business = await _repository.GetByIdAsync(id);
            if (business != null)
            {
                _repository.Remove(business);
                await _repository.SaveChangesAsync();
            }
        }
    }
}
