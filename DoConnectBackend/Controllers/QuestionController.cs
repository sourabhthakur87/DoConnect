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
    public class QuestionController : ControllerBase
    {
        private readonly DoDBContext _doDBContext;
        IWebHostEnvironment _webHostEnvironment;


        public QuestionController(DoDBContext dBContext, IWebHostEnvironment webHostEnvironment)
        {
            _doDBContext = dBContext;
            _webHostEnvironment = webHostEnvironment;

        }




        // [HttpPost("ask")]
        // [Authorize(Roles = "User")]
        // public async Task<IActionResult> AskQuestion([FromBody] QuestionRequest req)
        // {
        //     if (!ModelState.IsValid)
        //         return BadRequest(ModelState);

        //     var loggedin_userId = int.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);


        //     var question = new Question
        //     {
        //         questionTitle = req.questionTitle,
        //         questionText = req.questionText,
        //         userId = loggedin_userId,
        //         Status = ApprovalStatus.Pending
        //     };

        //     _doDBContext.Questions.Add(question);
        //     await _doDBContext.SaveChangesAsync();

        //     return Ok(new { message = "Question submitted, awaiting admin approval" });
        // }

        [HttpPost("ask")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> AskQuestionWithImage([FromForm] QuestionImageRequest req)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // get logged-in user id if you need to set userId on Question
            var loggedin_userId = int.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);

            // 1) Save the question first
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
                // Handle image upload
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

            // Return the response with or without image path
            return Ok(new
            {
                message = "Question added successfully",
                questionId = question.questionId,
                imagePath = savedFileName // If no image, this will be null
            });
        }





        // ----------------------------------------------------------------------------------------------------------------------
        [HttpGet("getQuestionById/{id}")]
        [Authorize]
        public async Task<IActionResult> getQuestionById(int id)
        {
            var question = await _doDBContext.Questions.FindAsync(id);
            if (question == null)
                return NotFound(new { message = "Question not found" });



            return Ok(question);
        }



        [HttpGet("approved")]
        [Authorize]
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


            // var questions = await _connectDbContext.Questions
            //  .Where(q => q.Status == ApprovalStatus.Approved)
            //  .Include(q => q.Answer) 
            //     .ToListAsync();

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
            var question = await _doDBContext.Questions.FindAsync(id);
            if (question == null)
                return NotFound(new { message = "Question not found" });

            _doDBContext.Questions.Remove(question);
            await _doDBContext.SaveChangesAsync();

            return Ok(new { message = "Question deleted successfully" });
        }

    }
}
