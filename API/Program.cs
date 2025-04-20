using API.Data;
using API.Extensions;


//using api.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);
var app = builder.Build();

// Configure the HTTP request pipeline.
//app.UseMiddleware<Exceptionmiddleware>();
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod()
.WithOrigins("http://localhost:4200" ,"https://localhost:4200"));

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
//code bellow to save migration
// using var scope = app.Services.CreateScope();   
// var services =  scope.ServiceProvider;
// try
// {
//     var context = services.GetRequiredService<DataContext>();
//     await context.Database.MigrateAsync();
//     await Seed.SeedUsers(context);
// }
// catch (Exception ex)
// {
//     var logger = services.GetRequiredService<ILogger<Program>>();
//     logger.LogError(ex , "an error occurred during migration");
     
// }
app.Run();
