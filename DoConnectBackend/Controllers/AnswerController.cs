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
        public AnswerController(DoDBContext doDBContext)
        {
            _doDBContext = doDBContext;
        }


        [HttpGet("final-question-answer")]
        [AllowAnonymous]
        public async Task<IActionResult> GetApprovedQuestionsWithAnswers()
        {
            var data = await _doDBContext.Questions
        .Include(q => q.User)
        .Include(q => q.Answer)
            .ThenInclude(a => a.User)
        .Where(q => q.Status == ApprovalStatus.Approved
            && q.Answer.Any(a => a.Status == ApprovalStatus.Approved))
        .Select(q => new
        {
            q.questionId,
            q.questionTitle,
            q.questionText,
            AskedBy = q.User.userName,
            Answers = q.Answer
                .Where(a => a.Status == ApprovalStatus.Approved)
                .Select(a => new
                {
                    a.answerId,
                    a.answerText,
                    AnsweredBy = a.User.userName
                }).ToList()
        })
        .ToListAsync();

            return Ok(data);
        }


        [HttpPost("add")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> PostAnswer(AnswerRequest req)
        {
            if (!ModelState.IsValid)
                return BadRequest("Error in Model state" + ModelState);

            var loggedin_userId = int.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);


            // Check question exists and is approved

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

            return Ok(new { message = "Answer submitted, awaiting admin approval" });
        }


        [HttpGet("approved/{questionId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetApprovedAnswers(int questionId)
        {
            var answers = await _doDBContext.Answers
                .Include(a => a.User)
                .Where(a => a.questionId == questionId && a.Status == ApprovalStatus.Approved)
                .Select(a => new
                {
                    a.answerId,
                    a.answerText,
                    AnsweredBy = a.User.userName
                })
                .ToListAsync();

            return Ok(answers);
        }


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
                    AnsweredBy = a.User.userName
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

            _doDBContext.Answers.Remove(answer);
            await _doDBContext.SaveChangesAsync();

            return Ok(new { message = "Answer deleted successfully" });
        }


    }
}
