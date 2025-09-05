using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DoConnectBackend.Models
{
    public class Question
    {
        [Key]
        public int questionId { get; set; }

        [Required]
        public string questionTitle { get; set; }

        [Required]
        public string questionText { get; set; }
        public ApprovalStatus Status { get; set; } = ApprovalStatus.Pending;

        [Required]
        public int userId { get; set; }
        [ForeignKey("userId")]
        public User? User { get; set; }
        public List<Answer> Answer { get; set; } = new List<Answer>();
        public List<Images> Images { get; set; } = new List<Images>();
    }
}
