using Microsoft.AspNetCore.Mvc;
using TbayIndigenousSupportHub.API.DTOs;
using TbayIndigenousSupportHub.API.Interfaces;

namespace TbayIndigenousSupportHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatbotController : ControllerBase
    {
        private readonly IChatbotService _chatbotService;

        public ChatbotController(IChatbotService chatbotService)
        {
            _chatbotService = chatbotService;
        }

        [HttpPost("ask")]
        public async Task<ActionResult<ApiResponse<string>>> AskChatbot([FromBody] ChatRequest request)
        {
            var response = await _chatbotService.GetResponseAsync(request.Message);
            return Ok(ApiResponse<string>.SuccessResponse(response));
        }

        public class ChatRequest
        {
            public string Message { get; set; } = string.Empty;
        }
    }
}
