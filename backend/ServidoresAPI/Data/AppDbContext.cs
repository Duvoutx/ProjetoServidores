using Microsoft.EntityFrameworkCore;
using ServidoresAPI.Models;

namespace ServidoresAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Servidor> Servidores { get; set; }
}