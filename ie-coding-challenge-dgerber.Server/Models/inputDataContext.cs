using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace ie_coding_challenge_dgerber.Server.Models
{
    public class InputDataContext : DbContext
    {
        public InputDataContext(DbContextOptions<InputDataContext> options)
        : base(options)
        {
        }

        public DbSet<InputData> GivenInputs { get; set; } = null!;
    }
}