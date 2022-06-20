using System.Text;
using API.services;
using Domain;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Persistance;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddIdentityCore<AppUser>(options =>
            {
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 3;
                options.Password.RequireUppercase = false;
            })
            .AddEntityFrameworkStores<DataContext>() // Sores are the context & Db
            .AddSignInManager<SignInManager<AppUser>>();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
            // Need to add this in order to have the SignInManager when needed
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opt =>
            {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            // Adding Custom Authz Policy
            services.AddAuthorization(options => options.AddPolicy("IsActivityHost", policy =>
            {
                policy.Requirements.Add(new IsHostRequirement());
            }));
            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();
            services.AddScoped<TokenService>();

            return services;
        }
    }
}