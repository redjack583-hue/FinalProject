using Microsoft.AspNetCore.Mvc;
using TbayIndigenousSupportHub.API.DTOs;
using TbayIndigenousSupportHub.API.Models;
using TbayIndigenousSupportHub.API.Services;

namespace TbayIndigenousSupportHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly SearchService _searchService;

        public SearchController(SearchService searchService)
        {
            _searchService = searchService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<object>>> Search(string? q, string? category, string? type)
        {
            var businesses = await _searchService.SearchBusinessesAsync(q, category);
            var events = await _searchService.SearchEventsAsync(q, type);
            var services = await _searchService.SearchServicesAsync(q, category);

            var result = new
            {
                businesses,
                events,
                services
            };

            return Ok(ApiResponse<object>.SuccessResponse(result));
        }

        [HttpGet("businesses")]
        public async Task<ActionResult<ApiResponse<IEnumerable<Business>>>> SearchBusinesses(string? q, string? category)
        {
            var results = await _searchService.SearchBusinessesAsync(q, category);
            return Ok(ApiResponse<IEnumerable<Business>>.SuccessResponse(results));
        }

        [HttpGet("events")]
        public async Task<ActionResult<ApiResponse<IEnumerable<Event>>>> SearchEvents(string? q, string? type)
        {
            var results = await _searchService.SearchEventsAsync(q, type);
            return Ok(ApiResponse<IEnumerable<Event>>.SuccessResponse(results));
        }

        [HttpGet("services")]
        public async Task<ActionResult<ApiResponse<IEnumerable<Service>>>> SearchServices(string? q, string? category)
        {
            var results = await _searchService.SearchServicesAsync(q, category);
            return Ok(ApiResponse<IEnumerable<Service>>.SuccessResponse(results));
        }
    }
}
