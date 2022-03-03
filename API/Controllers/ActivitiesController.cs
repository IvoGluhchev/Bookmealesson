using System.Linq;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        private readonly DataContext _context;
        public ActivitiesController(DataContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await _context.Activities.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(Guid id)
        {
            if (id == null || Guid.Empty == id) return BadRequest();

            var result = await _context.Activities.FindAsync(id);

            if(result != null) return result;

            return NotFound();
         }
    }
}