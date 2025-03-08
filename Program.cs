using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TicTacToe.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllersWithViews();
builder.Services.AddSignalR(); // Add SignalR services

var app = builder.Build();

// Middleware
app.UseStaticFiles();
app.UseRouting();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=Game}/{action=Index}/{id?}");
    endpoints.MapHub<GameHub>("/gamehub"); // Map the SignalR hub
});



app.UseCors("AllowAll");

app.Run();

