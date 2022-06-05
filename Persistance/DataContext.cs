using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistance;

// Section 2 is the info for the Database
public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Activity> Activities { get; set; }
}
