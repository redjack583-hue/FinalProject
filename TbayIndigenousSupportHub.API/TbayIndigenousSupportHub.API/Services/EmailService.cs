using System.Net;
using System.Net.Mail;

namespace TbayIndigenousSupportHub.API.Services
{

    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void SendOtpEmail(string toEmail, string otp)
        {
            var smtpSection = _configuration.GetSection("SmtpSettings");

            var client = new SmtpClient(smtpSection["Host"])
            {
                Port = int.Parse(smtpSection["Port"]),
                Credentials = new NetworkCredential(
                    smtpSection["SenderEmail"],
                    smtpSection["SenderPassword"]),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(smtpSection["SenderEmail"]),
                Subject = "Your OTP Code - Tbay Indigenous Support Hub",
                Body = $"Your OTP is: {otp}. It will expire in 5 minutes.",
                IsBodyHtml = false,
            };

            mailMessage.To.Add(toEmail);

            client.Send(mailMessage);
        }
    }
}