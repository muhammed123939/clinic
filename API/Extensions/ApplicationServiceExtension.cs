using API.Data;
using API.helpers;
using API.interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;
namespace API.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
    IConfiguration config)
    {
        services.AddControllers();
        services.AddDbContext<DataContext>(opt =>
        {
            opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
        });

        services.AddCors();

        services.AddScoped<IAdminRepository, AdminRepository>();
        services.AddScoped<IAppointmentRepository, AppointmentRepository>();
        services.AddScoped<IDoctorRepository, DoctorRepository>();
        services.AddScoped<IGroupRepository, GroupRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IpatientRepository, PatientRepository>();
        services.AddScoped<IPhotoService, PhotoService>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IStoreRepository, StoreRepository>();
        services.AddScoped<ItokenService, TokenService>();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
        return services;
    }
}