using DoConnectBackend.Data;
using DoConnectBackend.Models;
using DoConnectBackend.RequestModel;
using DoConnectBackend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DoConnectBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DoDBContext _doDBContext;
        private readonly TokenJwt _tokenJwt;
        private readonly PasswordHasher<User> _passwordHasher;


        public UserController(DoDBContext doDBContext, TokenJwt tokenJwt)
        {
            _doDBContext = doDBContext;
            _tokenJwt = tokenJwt;
            _passwordHasher = new PasswordHasher<User>();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var alreadyExists = await _doDBContext.Users.AnyAsync(u => u.userName == req.userName || u.Email == req.Email);

            if (alreadyExists)
            {
                return BadRequest(new { message = "UserName or Email Already Exist" });
            }
            var user = new User
            {
                userName = req.userName,
                Email = req.Email,
                Password = _passwordHasher.HashPassword(null, req.Password),
                Role = req.Role
            };
            _doDBContext.Users.Add(user);
            await _doDBContext.SaveChangesAsync();

            return Ok(new { message = "Register Success, Please Login" });
        }




        [HttpPost("login")]

        public async Task<IActionResult> Login(LoginRequest req)
        {
            var userPresent = await _doDBContext.Users.FirstOrDefaultAsync(u =>u.userName == req.userName);


            var passwordVerification = _passwordHasher.VerifyHashedPassword(userPresent, userPresent.Password, req.Password);

            if (passwordVerification == PasswordVerificationResult.Failed)
            {
                return Unauthorized("Invalid credentials");
            }

            var token = _tokenJwt.GenerateToken(userPresent);

            return Ok(new
            {
                token,
                userName = userPresent.userName,
                Role = userPresent.Role,
                userId = userPresent.userId

            });
        }
    }
}
