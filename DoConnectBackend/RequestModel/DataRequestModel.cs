using System.ComponentModel.DataAnnotations;
using DoConnectBackend.Models;

namespace DoConnectBackend.RequestModel
{
    public class RegisterRequest
    {
        [Required]
        public string userName { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        public UserRole Role { get; set; } = UserRole.User;
    }

    public class LoginRequest
    {
        [Required]
        public string userName { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class QuestionRequest
    {
        [Required]
        [MaxLength(200)]
        public string questionTitle { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string questionText { get; set; } = string.Empty;
    }

    public class QuestionImageRequest
    {
        public string questionTitle { get; set; }
        public string questionText { get; set; }
        public IFormFile? Photo { get; set; }
        public string? imageName { get; set; }
        
    }




    public class AnswerRequest
    {
        [Required]
        [MaxLength(1000)]
        public string answerText { get; set; } = string.Empty;

        [Required]
        public int questionId { get; set; }
    }

    public class ImageREQ()
    {
        public string imageName { get; set; }

        [Required]
        public IFormFile Photo { get; set; }

        [Required]
        public int questionId { get; set; }
    }

}
