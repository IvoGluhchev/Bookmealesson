using System.Linq;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistance;
using MediatR;
using Application.Activities;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities(CancellationToken cancellationToken)
        {
            return await Mediator.Send(new List.Query(), cancellationToken);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(Guid id, CancellationToken cancellationToken)
        {
            if (id == null || Guid.Empty == id) return BadRequest();

            var result = await Mediator.Send(new Details.Query { Id = id }, cancellationToken);

            if (result != null) return result;

            return NotFound();
        }

        // When returning IActionResult we have access to BadRequest() etc.
        // Because it inherits from api controller the controller knows to look into the body
        // we could give it a hint bu adding [FromBody]
        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid) return BadRequest();

            return Ok(await Mediator.Send(new Create.Command { Activity = activity }, cancellationToken));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid) return BadRequest();
            if (id == Guid.Empty) return BadRequest();

            activity.Id = id;

            return Ok(await Mediator.Send(new Edit.Command { Activity = activity }, cancellationToken));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            if (!ModelState.IsValid) return BadRequest();
            if (id == Guid.Empty) return BadRequest();

            return Ok(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}