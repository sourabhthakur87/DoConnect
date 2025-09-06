using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DoConnectBackend.Models
{
    public class Images
    {
        [Key]
        public int ImageId { get; set; }
        public string imageName { get; set; }
        public string ImagePath { get; set; }
        public int? questionId { get; set; }

        [ForeignKey("questionId")]
        public Question? Question { get; set; }


        public int? answerId { get; set; }

        [ForeignKey("answerId")]
        public Answer? Answer { get; set; }

    }
}
