namespace TbayIndigenousSupportHub.API.Interfaces
{
    public interface IChatbotService
    {
        Task<string> GetResponseAsync(string message);
    }
}
