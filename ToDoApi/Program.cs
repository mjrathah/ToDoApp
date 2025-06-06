using Microsoft.EntityFrameworkCore;
using ToDoApi.Data;
using Microsoft.AspNetCore.StaticFiles;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev",
        policy => policy
            .WithOrigins("http://localhost:4200") // Angular dev server
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios.
    app.UseHsts();
}

app.UseHttpsRedirection();

// Configure static file serving with proper caching
var staticFileOptions = new StaticFileOptions
{
    ContentTypeProvider = new FileExtensionContentTypeProvider(),
    OnPrepareResponse = ctx =>
    {
        // Cache static files for 1 year
        ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=31536000");
    }
};

app.UseStaticFiles(staticFileOptions);

// For Angular routing - map all non-api routes to index.html
app.MapWhen(ctx => !ctx.Request.Path.StartsWithSegments("/api"), client =>
{
    client.UseStaticFiles(staticFileOptions);
    client.UseRouting();
    
    client.UseEndpoints(endpoints =>
    {
        endpoints.MapFallbackToFile("index.html");
    });
});

// Special handling for service worker
app.Map("/service-worker.js", sw =>
{
    sw.UseStaticFiles(new StaticFileOptions 
    { 
        ServeUnknownFileTypes = true, 
        ContentTypeProvider = new FileExtensionContentTypeProvider() 
    });
});

// Apply database migrations
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
    }
}
app.UseCors("AllowAngularDev");
app.MapControllers();

app.Run();