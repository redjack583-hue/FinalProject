using Microsoft.AspNetCore.Mvc;
using TbayIndigenousSupportHub.API.Models;
using Microsoft.AspNetCore.Authorization;
using TbayIndigenousSupportHub.API.Interfaces;
using TbayIndigenousSupportHub.API.DTOs;

namespace TbayIndigenousSupportHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EventsController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<Event>>>> GetEvents()
        {
            var events = await _eventService.GetAllEventsAsync();
            return Ok(ApiResponse<IEnumerable<Event>>.SuccessResponse(events));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Event>>> GetEvent(int id)
        {
            var @event = await _eventService.GetEventByIdAsync(id);
            if (@event == null) 
                return NotFound(ApiResponse<Event>.ErrorResponse("Event not found."));
            
            return Ok(ApiResponse<Event>.SuccessResponse(@event));
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ApiResponse<Event>>> CreateEvent(Event @event)
        {
            var createdEvent = await _eventService.CreateEventAsync(@event);
            return CreatedAtAction(nameof(GetEvent), 
                new { id = createdEvent.EventId }, 
                ApiResponse<Event>.SuccessResponse(createdEvent, "Event created successfully."));
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<string>>> UpdateEvent(int id, Event @event)
        {
            if (id != @event.EventId) 
                return BadRequest(ApiResponse<string>.ErrorResponse("ID mismatch."));
            
            await _eventService.UpdateEventAsync(@event);
            return Ok(ApiResponse<string>.SuccessResponse("Event updated successfully."));
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<string>>> DeleteEvent(int id)
        {
            var @event = await _eventService.GetEventByIdAsync(id);
            if (@event == null) 
                return NotFound(ApiResponse<string>.ErrorResponse("Event not found."));

            await _eventService.DeleteEventAsync(id);
            return Ok(ApiResponse<string>.SuccessResponse("Event deleted successfully."));
        }
    }
}
