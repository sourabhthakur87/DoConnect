using System.ComponentModel.DataAnnotations;

namespace DoConnectBackend.Models
{
    public class User
    {
        [Key]
        public int userId { get; set; }

        [Required]
        public string userName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public UserRole Role { get; set; } = UserRole.User;

        public List<Question> Questions { get; set; }
        public List<Answer> Answers { get; set; }
    }
}
