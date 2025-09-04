using DoConnectBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace DoConnectBackend.Data
{
    public class DoDBContext:DbContext
    {
        public DoDBContext(DbContextOptions options):base(options)
        {
            
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Images> Images { get; set; }
    }
}
