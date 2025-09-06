using System.ComponentModel.DataAnnotations;

namespace DoConnectBackend.Models
{
    public class User
    {
        [Key]
        public int userId { get; set; }

        [Required]
        public string userName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }

        public UserRole Role { get; set; } = UserRole.User;

        public List<Question> Questions { get; set; }
        public List<Answer> Answers { get; set; }
    }
}
