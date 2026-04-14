using Microsoft.AspNetCore.Mvc;
using TbayIndigenousSupportHub.API.Models;
using Microsoft.AspNetCore.Authorization;
using TbayIndigenousSupportHub.API.Interfaces;
using TbayIndigenousSupportHub.API.DTOs;

namespace TbayIndigenousSupportHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessesController : ControllerBase
    {
        private readonly IBusinessService _businessService;

        public BusinessesController(IBusinessService businessService)
        {
            _businessService = businessService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<Business>>>> GetBusinesses()
        {
            var businesses = await _businessService.GetAllBusinessesAsync();
            return Ok(ApiResponse<IEnumerable<Business>>.SuccessResponse(businesses));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Business>>> GetBusiness(int id)
        {
            var business = await _businessService.GetBusinessByIdAsync(id);
            if (business == null) 
                return NotFound(ApiResponse<Business>.ErrorResponse("Business not found."));
            
            return Ok(ApiResponse<Business>.SuccessResponse(business));
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ApiResponse<Business>>> CreateBusiness(Business business)
        {
            var createdBusiness = await _businessService.CreateBusinessAsync(business);
            return CreatedAtAction(nameof(GetBusiness), 
                new { id = createdBusiness.BusinessId }, 
                ApiResponse<Business>.SuccessResponse(createdBusiness, "Business created successfully."));
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<string>>> UpdateBusiness(int id, Business business)
        {
            if (id != business.BusinessId) 
                return BadRequest(ApiResponse<string>.ErrorResponse("ID mismatch."));
            
            await _businessService.UpdateBusinessAsync(business);
            return Ok(ApiResponse<string>.SuccessResponse("Business updated successfully."));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<string>>> DeleteBusiness(int id)
        {
            var business = await _businessService.GetBusinessByIdAsync(id);
            if (business == null) 
                return NotFound(ApiResponse<string>.ErrorResponse("Business not found."));

            await _businessService.DeleteBusinessAsync(id);
            return Ok(ApiResponse<string>.SuccessResponse("Business deleted successfully."));
        }
    }
}
