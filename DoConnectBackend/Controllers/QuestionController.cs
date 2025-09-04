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

        public QuestionController(DoDBContext dBContext)
        {
            _doDBContext = dBContext;
        }




        [HttpPost("ask")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> AskQuestion([FromBody] QuestionRequest req)
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

            return Ok(new { message = "Question submitted, awaiting admin approval" });
        }


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
            askedBy = q.User.userName
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
                    AskedBy = q.User.userName
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
