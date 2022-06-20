using Application.Activities;
using Application.Core;
using Application.Interfaces;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Persistance;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPIv5", Version = "v1" });
            });

            services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlite(configuration.GetConnectionString("DefaultConnection"));
            });

            // Cross Origin Policy for allowing
            // Every method and any Header comming from  a certain origin (localhost...)
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
                });
            });

            // Add Mediator service library
            services.AddMediatR(typeof(List.Handler).Assembly);
            // AutoMapper - I'm not using
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            services.AddScoped<IUserAccessor, UserAccessor>();

            return services;
        }
    }
}