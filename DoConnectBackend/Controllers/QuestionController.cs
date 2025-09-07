using System.Security.Claims;
using DoConnectBackend.Data;
using DoConnectBackend.Models;
using DoConnectBackend.RequestModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace DoConnectBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly DoDBContext _doDBContext;
        IWebHostEnvironment _webHostEnvironment;


        public QuestionController(DoDBContext dBContext, IWebHostEnvironment webHostEnvironment)
        {
            _doDBContext = dBContext;
            _webHostEnvironment = webHostEnvironment;

        }

        [HttpPost("ask")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> AskQuestionWithImage([FromForm] QuestionImageRequest req)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var loggedin_userId = int.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);

            var question = new Question
            {
                questionTitle = req.questionTitle,
                questionText = req.questionText,
                userId = loggedin_userId,
                Status = ApprovalStatus.Pending
            };

            _doDBContext.Questions.Add(question);
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
                    questionId = question.questionId
                };

                _doDBContext.Images.Add(img);

                await _doDBContext.SaveChangesAsync();
            }

            return Ok(new
            {
                message = "Question added successfully",
                questionId = question.questionId,
                imagePath = savedFileName
            });
        }





        [HttpGet("approved")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetApprovedQuestions()
        {
            var questions = await _doDBContext.Questions
        .Where(q => q.Status == ApprovalStatus.Approved
            && !q.Answer.Any(a => a.Status == ApprovalStatus.Approved))
        .Select(q => new
        {
            q.questionId,
            q.questionTitle,
            q.questionText,
            askedBy = q.User.userName,
            imagePath = _doDBContext.Images
                        .Where(i => i.questionId == q.questionId)
                        .Select(i => i.ImagePath)
                        .FirstOrDefault()
        }).ToListAsync();
            return Ok(questions);
        }




        [HttpGet("pending")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPendingQuestions()
        {
            var questions = await _doDBContext.Questions
                .Include(q => q.User)
                .Where(q => q.Status == ApprovalStatus.Pending)
                .Select(q => new
                {
                    q.questionId,
                    q.questionTitle,
                    q.questionText,
                    AskedBy = q.User.userName,
                    imagePath = _doDBContext.Images
                        .Where(i => i.questionId == q.questionId)
                        .Select(i => i.ImagePath)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(questions);
        }





        [HttpGet("reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetRejectedQuestions()
        {
            var questions = await _doDBContext.Questions
                .Include(q => q.User)
                .Where(q => q.Status == ApprovalStatus.Rejected)
                .Select(q => new
                {
                    q.questionId,
                    q.questionTitle,
                    q.questionText,
                    AskedBy = q.User.userName,
                    imagePath = _doDBContext.Images
                        .Where(i => i.questionId == q.questionId)
                        .Select(i => i.ImagePath)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(questions);
        }





        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveQuestion(int id)
        {
            var question = await _doDBContext.Questions.FindAsync(id);
            if (question == null)
                return NotFound(new { message = "Question not found" });

            question.Status = ApprovalStatus.Approved;
            await _doDBContext.SaveChangesAsync();

            return Ok(new { message = "Question approved successfully" });
        }


        [HttpPut("{id}/reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RejectQuestion(int id)
        {
            var question = await _doDBContext.Questions.FindAsync(id);
            if (question == null)
                return NotFound(new { message = "Question not found" });

            question.Status = ApprovalStatus.Rejected;
            await _doDBContext.SaveChangesAsync();

            return Ok(new { message = "Question rejected successfully" });
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            // Fetch the question including related data if needed
            var question = await _doDBContext.Questions.FindAsync(id);
            if (question == null)
                return NotFound(new { message = "Question not found" });

            try
            {
                var relatedImages = await _doDBContext.Images
                    .Where(img => img.questionId == id)
                    .ToListAsync();

                _doDBContext.Images.RemoveRange(relatedImages);

                // 🗑️ 3. Delete the question
                _doDBContext.Questions.Remove(question);

                // 💾 4. Save changes
                await _doDBContext.SaveChangesAsync();

                return Ok(new { message = "Question, related images, and answers deleted successfully" });
            }
            catch (Exception ex)
            {
                // Log or return detailed error
                return StatusCode(500, new { message = "An error occurred while deleting the question.", error = ex.Message });
            }
        }




        [HttpGet("search")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> SearchApprovedUnansweredQuestions([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest(new { message = "Search query cannot be empty." });

            var results = await _doDBContext.Questions
                .Include(q => q.User)
                .Where(q => q.Status == ApprovalStatus.Approved &&
                            !q.Answer.Any(a => a.Status == ApprovalStatus.Approved) && // ✅ No approved answers
                            (q.questionTitle.Contains(query) || q.questionText.Contains(query)))
                .Select(q => new
                {
                    q.questionId,
                    q.questionTitle,
                    q.questionText,
                    askedBy = q.User.userName,
                    imagePath = _doDBContext.Images
                        .Where(img => img.questionId == q.questionId && img.answerId == null)
                        .Select(img => img.ImagePath)
                        .FirstOrDefault()
                })
                .ToListAsync();

            if (!results.Any())
                return Ok(new { message = "No matching approved and unanswered questions found." });

            return Ok(results);
        }


    }
}
