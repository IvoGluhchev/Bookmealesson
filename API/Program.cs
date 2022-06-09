using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistance;
using Persistence;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            // This is going to be disposed once the Main method finishes because of using keyword
            // we are going to save all our servicese here
            using var scope = host.Services.CreateScope();

            var services = scope.ServiceProvider;

            try
            {
                // We have added this context as a service in the Startup and we are getting it here
                var context = services.GetRequiredService<DataContext>(); // Thi is service locator pattern
                var userManager = services.GetRequiredService<UserManager<AppUser>>();

                await context.Database.MigrateAsync(); // Comming from EFCore
                await Seed.SeedData(context, userManager);
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "Error during Migration.");
            }

            // We need to start our application
            await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
