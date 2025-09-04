using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DoConnectBackend.Models
{
    public class Answer
    {
        [Key]
        public int answerId { get; set; }

        [Required]
        public string answerText { get; set; }
        public ApprovalStatus Status { get; set; } = ApprovalStatus.Pending;


        [Required]
        public int questionId { get; set; }

        [ForeignKey("questionId")]
        public Question? Question { get; set; }

        [Required]
        public int userId { get; set; }

        [ForeignKey("userId")]
        public User? User { get; set; }
    }
}
