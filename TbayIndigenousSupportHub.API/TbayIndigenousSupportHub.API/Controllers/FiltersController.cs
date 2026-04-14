using Microsoft.AspNetCore.Mvc;
using TbayIndigenousSupportHub.API.Models;
using Microsoft.AspNetCore.Authorization;
using TbayIndigenousSupportHub.API.Interfaces;
using TbayIndigenousSupportHub.API.DTOs;

namespace TbayIndigenousSupportHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FiltersController : ControllerBase
    {
        private readonly IHubService _hubService;

        public FiltersController(IHubService hubService)
        {
            _hubService = hubService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<FilterOption>>>> GetFilters()
        {
            var filters = await _hubService.GetFilterOptionsAsync();
            return Ok(ApiResponse<IEnumerable<FilterOption>>.SuccessResponse(filters));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<ApiResponse<FilterOption>>> CreateFilter(FilterOption filter)
        {
            var createdFilter = await _hubService.CreateFilterOptionAsync(filter);
            return Ok(ApiResponse<FilterOption>.SuccessResponse(createdFilter, "Filter option created successfully."));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<string>>> UpdateFilter(int id, FilterOption filter)
        {
            if (id != filter.Id) 
                return BadRequest(ApiResponse<string>.ErrorResponse("ID mismatch."));
            
            await _hubService.UpdateFilterOptionAsync(filter);
            return Ok(ApiResponse<string>.SuccessResponse("Filter option updated successfully."));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<string>>> DeleteFilter(int id)
        {
            await _hubService.DeleteFilterOptionAsync(id);
            return Ok(ApiResponse<string>.SuccessResponse("Filter option deleted successfully."));
        }
    }
}
