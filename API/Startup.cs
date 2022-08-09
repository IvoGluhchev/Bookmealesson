using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;
using Application.Activities;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Persistance;
using FluentValidation.AspNetCore;
using API.Middleware;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using API.SignalR;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers(opt =>
            {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            })
            .AddFluentValidation(config =>
            {
                // Tell where our validators are comming from
                // Any validators that live in this assembly will be picked up and registered w/ our controllers
                // We need to this only once for all of our handlers
                config.RegisterValidatorsFromAssemblyContaining<Create>();
            });
            services.AddApplicationServices(_configuration);
            services.AddIdentityServices(_configuration);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        // Effectively everything that is in this method is middle-ware
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ExceptionMiddleware>();

            app.UseXContentTypeOptions();
            app.UseReferrerPolicy(opt => opt.NoReferrer());
            app.UseXXssProtection(opt => opt.EnabledWithBlockMode()); // Cross site scripting
            app.UseXfo(opt => opt.Deny()); // deny site to opened in iFrame
            app.UseCsp(opt => opt
               .BlockAllMixedContent()
               .StyleSources(s => s.Self().CustomSources(
                   "https://fonts.googleapis.com",
                   "sha256-/epqQuRElKW1Z83z1Sg8Bs2MKi99Nrq41Z3fnS2Nrgk=",
                   "sha256-2aahydUs+he2AO0g7YZuG67RGvfE9VXGbycVgIwMnBI=",
                   "sha256-+oGcdj5BhO6SoiIGYIkPOMYi7d2h2Pp/bkJLBfYL+kk=",
                   "https://fonts.gstatic.com",
                   "https://cdn.jsdelivr.net"
               ))
               .FontSources(s => s.Self().CustomSources(
                   "https://fonts.gstatic.com",
                   "data:",
                   "https://cdn.jsdelivr.net"
               ))
               .FormActions(s => s.Self())
               .FrameAncestors(s => s.Self())
               .ImageSources(s => s.Self().CustomSources(
                   "https://res.cloudinary.com",
                   "https://www.facebook.com",
                   "https://platform-lookaside.fbsbx.com",
                   "blob:"
                   ))
               .ScriptSources(s => s.Self()
                   .CustomSources(
                       "sha256-HIgflxNtM43xg36bBIUoPTUuo+CXZ319LsTVRtsZ/VU=",
                       "https://connect.facebook.net",
                       "sha256-3x3EykMfFJtFd84iFKuZG0MoGAo5XdRfl3rq3r//ydA=",
                       "https://cdn.jsdelivr.net"
                   ))
           );

            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
            }
            else
            {
                app.Use(async (context, next) =>
                {
                    context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
                    await next.Invoke();
                });
            }

            // app.UseHttpsRedirection();

            app.UseRouting();

            // this middleware will look into the wwroot folder for anything that is called index.html
            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseCors("CorsPolicy");

            // Ordering is crucial
            // Authentication before AutZ
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/chat");
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}
