using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoApi.Data;
using ToDoApi.Models;

namespace ToDoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ToDoController : ControllerBase
{
    private readonly AppDbContext _context;
    
    public ToDoController(AppDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetItems()
    {
        var items = await _context.ToDoItems.ToListAsync();
        return Ok(items);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetItem(int id)
    {
        var item = await _context.ToDoItems.FindAsync(id);
        return item == null ? NotFound() : Ok(item);
    }
    
    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] ToDoItem item)
    {
        _context.ToDoItems.Add(item);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetItem), new { id = item.Id }, item);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] ToDoItem item)
    {
        if (id != item.Id) return BadRequest();
        
        _context.Entry(item).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var item = await _context.ToDoItems.FindAsync(id);
        if (item == null) return NotFound();
        
        _context.ToDoItems.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
