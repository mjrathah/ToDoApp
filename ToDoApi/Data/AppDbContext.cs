using Microsoft.EntityFrameworkCore;
using ToDoApi.Models;

namespace ToDoApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
    public DbSet<ToDoItem> ToDoItems { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ToDoItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(100);
            entity.Property(e => e.Description)
                .HasMaxLength(500);
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("GETUTCDATE()");

            // Seed initial data
            entity.HasData(
                new ToDoItem
                {
                    Id = 1,
                    Title = "Sample Task",
                    Description = "This is a sample task",
                    IsCompleted = false
                }
            );
        });
    }
}