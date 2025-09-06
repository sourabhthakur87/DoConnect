using System.Security.Claims;
using DoConnectBackend.Data;
using DoConnectBackend.Models;
using DoConnectBackend.RequestModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DoConnectBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnswerController : ControllerBase
    {
        private readonly DoDBContext _doDBContext;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public AnswerController(DoDBContext doDBContext, IWebHostEnvironment webHostEnvironment)
        {
            _doDBContext = doDBContext;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet("final-question-answer")]
        [AllowAnonymous]
        public async Task<IActionResult> GetApprovedQuestionsWithAnswers()
        {
            var data = await _doDBContext.Questions
                .Include(q => q.User)
                .Include(q => q.Answer)
                    .ThenInclude(a => a.User)
                .Where(q => q.Status == ApprovalStatus.Approved &&
                            q.Answer.Any(a => a.Status == ApprovalStatus.Approved))
                .Select(q => new
                {
                    q.questionId,
                    q.questionTitle,
                    q.questionText,
                    AskedBy = q.User.userName,
                    QuestionImagePath = _doDBContext.Images
                        .Where(img => img.questionId == q.questionId && img.answerId == null)
                        .Select(img => img.ImagePath)
                        .FirstOrDefault(),
                    Answers = q.Answer
                        .Where(a => a.Status == ApprovalStatus.Approved)
                        .Select(a => new
                        {
                            a.answerId,
                            a.answerText,
                            AnsweredBy = a.User.userName,
                            AnswerImagePath = _doDBContext.Images
                                .Where(img => img.answerId == a.answerId)
                                .Select(img => img.ImagePath)
                                .FirstOrDefault()
                        }).ToList()
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpPost("add")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> PostAnswer(AnswerWithImageRequest req)
        {
            if (!ModelState.IsValid)
                return BadRequest("Error in Model state" + ModelState);

            var loggedin_userId = int.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);

            var question = await _doDBContext.Questions.FindAsync(req.questionId);
            if (question == null)
                return NotFound(new { message = "Question not found" });

            if (question.Status != ApprovalStatus.Approved)
                return BadRequest(new { message = "You can only answer approved questions" });

            var answer = new Answer
            {
                answerText = req.answerText,
                questionId = req.questionId,
                userId = loggedin_userId,
                Status = ApprovalStatus.Pending
            };

            _doDBContext.Answers.Add(answer);
            await _doDBContext.SaveChangesAsync();

            string? savedFileName = null;
            if (req.Photo != null && req.Photo.Length > 0)
            {
                string folder = Path.Combine(_webHostEnvironment.WebRootPath, "images");
                if (!Directory.Exists(folder))
                    Directory.CreateDirectory(folder);

                savedFileName = $"{Guid.NewGuid()}_{req.Photo.FileName}";
                string path = Path.Combine(folder, savedFileName);

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await req.Photo.CopyToAsync(stream);
                }

                var img = new Images
                {
                    imageName = string.IsNullOrWhiteSpace(req.imageName) ? req.Photo.FileName : req.imageName,
                    ImagePath = savedFileName,
                    answerId = answer.answerId
                };

                _doDBContext.Images.Add(img);
                await _doDBContext.SaveChangesAsync();
            }

            return Ok(new
            {
                message = "Answer submitted, awaiting admin approval",
                answerId = answer.answerId,
                imagePath = savedFileName
            });
        }




        // [HttpGet("approved/{questionId}")]
        // [AllowAnonymous]
        // public async Task<IActionResult> GetApprovedAnswers(int questionId)
        // {
        //     var answers = await _doDBContext.Answers
        //         .Include(a => a.User)
        //         .Where(a => a.questionId == questionId && a.Status == ApprovalStatus.Approved)
        //         .Select(a => new
        //         {
        //             a.answerId,
        //             a.answerText,
        //             AnsweredBy = a.User.userName,

        //             AnswerImagePath = _doDBContext.Images
        //                 .Where(i => i.answerId == a.answerId)
        //                 .Select(i => i.ImagePath)
        //                 .FirstOrDefault(),

        //             QuestionImagePath = _doDBContext.Images
        //                 .Where(i => i.questionId == questionId && i.answerId == null)
        //                 .Select(i => i.ImagePath)
        //                 .FirstOrDefault()
        //         })
        //         .ToListAsync();

        //     return Ok(answers);
        // }

        [HttpGet("pending")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPendingAnswers()
        {
            var answers = await _doDBContext.Answers
                .Include(a => a.User)
                .Include(a => a.Question)
                .Where(a => a.Status == ApprovalStatus.Pending)
                .Select(a => new
                {
                    a.answerId,
                    a.answerText,
                    QuestionTitle = a.Question.questionTitle,
                    QuestionText = a.Question.questionText,
                    AnsweredBy = a.User.userName,
                    AnswerImagePath = _doDBContext.Images
                        .Where(img => img.answerId == a.answerId)
                        .Select(img => img.ImagePath)
                        .FirstOrDefault(),
                    QuestionImagePath = _doDBContext.Images
                        .Where(img => img.questionId == a.questionId && img.answerId == null)
                        .Select(img => img.ImagePath)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(answers);
        }

        [HttpGet("reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetRejectedAnswers()
        {
            var answers = await _doDBContext.Answers
                .Include(a => a.User)
                .Include(a => a.Question)
                .Where(a => a.Status == ApprovalStatus.Rejected)
                .Select(a => new
                {
                    a.answerId,
                    a.answerText,
                    QuestionTitle = a.Question.questionTitle,
                    QuestionText = a.Question.questionText,
                    AnsweredBy = a.User.userName,
                    AnswerImagePath = _doDBContext.Images
                        .Where(img => img.answerId == a.answerId)
                        .Select(img => img.ImagePath)
                        .FirstOrDefault(),
                    QuestionImagePath = _doDBContext.Images
                        .Where(img => img.questionId == a.questionId && img.answerId == null)
                        .Select(img => img.ImagePath)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(answers);
        }

        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveAnswer(int id)
        {
            var answer = await _doDBContext.Answers.FindAsync(id);
            if (answer == null)
                return NotFound(new { message = "Answer not found" });

            answer.Status = ApprovalStatus.Approved;
            await _doDBContext.SaveChangesAsync();

            return Ok(new { message = "Answer approved successfully" });
        }

        [HttpPut("{id}/reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RejectAnswer(int id)
        {
            var answer = await _doDBContext.Answers.FindAsync(id);
            if (answer == null)
                return NotFound(new { message = "Answer not found" });

            answer.Status = ApprovalStatus.Rejected;
            await _doDBContext.SaveChangesAsync();

            return Ok(new { message = "Answer rejected successfully" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAnswer(int id)
        {
            var answer = await _doDBContext.Answers.FindAsync(id);
            if (answer == null)
                return NotFound(new { message = "Answer not found" });

            try
            {
                var relatedImages = await _doDBContext.Images
                    .Where(img => img.answerId == id)
                    .ToListAsync();

                _doDBContext.Images.RemoveRange(relatedImages);

                _doDBContext.Answers.Remove(answer);

                // 💾 Save changes
                await _doDBContext.SaveChangesAsync();

                return Ok(new { message = "Answer and associated images deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while deleting the answer.",
                    error = ex.Message
                });
            }
        }
    }
}
