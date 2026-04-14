using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using TbayIndigenousSupportHub.API.Interfaces;
using TbayIndigenousSupportHub.API.Models;

namespace TbayIndigenousSupportHub.API.Services
{
    public class GeminiSettings
    {
        public string ApiKey { get; set; } = string.Empty;
        public string BaseUrl { get; set; } = string.Empty;
    }

    public class ChatbotService : IChatbotService
    {
        private readonly HttpClient _httpClient;
        private readonly GeminiSettings _settings;
        private readonly IHubService _hubService;
        private readonly IBusinessService _businessService;
        private readonly IEventService _eventService;

        public ChatbotService(
            HttpClient httpClient, 
            IOptions<GeminiSettings> settings,
            IHubService hubService,
            IBusinessService businessService,
            IEventService eventService)
        {
            _httpClient = httpClient;
            _settings = settings.Value;
            _hubService = hubService;
            _businessService = businessService;
            _eventService = eventService;
        }

        public async Task<string> GetResponseAsync(string message)
        {
            if (string.IsNullOrEmpty(_settings.ApiKey) || _settings.ApiKey == "YOUR_GEMINI_API_KEY_HERE")
            {
                return "I'm sorry, the chatbot is not fully configured (API Key missing). Please contact the administrator.";
            }

            var context = await BuildSystemPromptAsync();
            
            var payload = new
            {
                model = "mistral-medium-latest",
                messages = new object[]
                {
                    new { role = "system", content = context },
                    new { role = "user", content = message }
                },
                temperature = 0.7,
                top_p = 0.9,
                max_tokens = 1024
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            
            using var request = new HttpRequestMessage(HttpMethod.Post, _settings.BaseUrl)
            {
                Content = content
            };
            request.Headers.Add("Authorization", $"Bearer {_settings.ApiKey}");

            try
            {
                var response = await _httpClient.SendAsync(request);
                
                if (!response.IsSuccessStatusCode)
                {
                    var errorBody = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"API Error: {response.StatusCode} - {errorBody}");
                    return "I encountered an error while trying to generate a response. Please try again later.";
                }

                var responseBody = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(responseBody);

                string? text = null;
                var choices = doc.RootElement.GetProperty("choices");
                if (choices.GetArrayLength() > 0)
                {
                    var choice = choices[0];
                    if (choice.TryGetProperty("message", out var messageElement) && messageElement.TryGetProperty("content", out var contentElement))
                    {
                        text = contentElement.GetString();
                    }
                    else if (choice.TryGetProperty("text", out var textElement))
                    {
                        text = textElement.GetString();
                    }
                }

                Console.WriteLine($"Chatbot Success response: {responseBody}");
                return text ?? "I'm not sure how to respond to that.";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Chatbot Exception: {ex.Message}");
                return "I encountered an error while trying to generate a response. Please try again later.";
            }
        }

        private async Task<string> BuildSystemPromptAsync()
        {
            var services = await _hubService.GetAllServicesAsync();
            var businesses = await _businessService.GetAllBusinessesAsync();
            var events = await _eventService.GetAllEventsAsync();

            var sb = new StringBuilder();
            sb.AppendLine("You are the Tbay Indigenous Support Hub Assistant. Your job is to help users find information about local Services, Businesses, and Events.");
            sb.AppendLine("INSTRUCTIONS:");
            sb.AppendLine("1. Use the data provided below when it applies, but you may also respond to general questions with helpful, friendly context from common knowledge.");
            sb.AppendLine("2. Do not mention or refer to the database, backend, or internal configuration in your reply.");
            sb.AppendLine("3. If the user asks about something not covered by the hub data, still provide a useful general answer and then offer to help with local hub listings.");
            sb.AppendLine("4. Keep responses short and concise unless the user asks for more details.");
            sb.AppendLine("5. Use a professional and culturally respectful tone.");
            sb.AppendLine("\n--- CURRENT HUB DATA ---");

            sb.AppendLine("\nSERVICES:");
            foreach (var s in services)
                sb.AppendLine($"- {s.ServiceName}: {s.Description} (Category: {s.Category})");

            sb.AppendLine("\nBUSINESSES:");
            foreach (var b in businesses)
                sb.AppendLine($"- {b.BusinessName}: {b.Description} (Contact: {b.Phone}, {b.Email})");

            sb.AppendLine("\nEVENTS:");
            foreach (var e in events)
                sb.AppendLine($"- {e.EventTitle}: {e.Description} (Date: {e.EventDate:MMM dd, yyyy}, Location: {e.Location})");

            sb.AppendLine("\n--- END OF DATA ---");
            
            return sb.ToString();
        }
    }
}
