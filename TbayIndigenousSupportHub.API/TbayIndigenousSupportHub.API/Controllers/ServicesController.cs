using Microsoft.AspNetCore.Mvc;
using TbayIndigenousSupportHub.API.Models;
using Microsoft.AspNetCore.Authorization;
using TbayIndigenousSupportHub.API.Interfaces;
using TbayIndigenousSupportHub.API.DTOs;

namespace TbayIndigenousSupportHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly IHubService _hubService;

        public ServicesController(IHubService hubService)
        {
            _hubService = hubService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<Service>>>> GetServices()
        {
            var services = await _hubService.GetAllServicesAsync();
            return Ok(ApiResponse<IEnumerable<Service>>.SuccessResponse(services));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Service>>> GetService(int id)
        {
            var service = await _hubService.GetServiceByIdAsync(id);
            if (service == null) 
                return NotFound(ApiResponse<Service>.ErrorResponse("Service not found."));
            
            return Ok(ApiResponse<Service>.SuccessResponse(service));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<ApiResponse<Service>>> CreateService(Service service)
        {
            var createdService = await _hubService.CreateServiceAsync(service);
            return CreatedAtAction(nameof(GetService), 
                new { id = createdService.ServiceId }, 
                ApiResponse<Service>.SuccessResponse(createdService, "Service created successfully."));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<string>>> UpdateService(int id, Service service)
        {
            if (id != service.ServiceId) 
                return BadRequest(ApiResponse<string>.ErrorResponse("ID mismatch."));
            
            await _hubService.UpdateServiceAsync(service);
            return Ok(ApiResponse<string>.SuccessResponse("Service updated successfully."));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<string>>> DeleteService(int id)
        {
            var service = await _hubService.GetServiceByIdAsync(id);
            if (service == null) 
                return NotFound(ApiResponse<string>.ErrorResponse("Service not found."));

            await _hubService.DeleteServiceAsync(id);
            return Ok(ApiResponse<string>.SuccessResponse("Service deleted successfully."));
        }
    }
}
