using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Activities;
using Microsoft.AspNetCore.Authorization;
using Application.Core;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetActivities([FromQuery] ActivityParams parameters, CancellationToken cancellationToken)
        {
            return HandlePagedResult(await Mediator.Send(new List.Query { Params = parameters }, cancellationToken));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetActivity(Guid id, CancellationToken cancellationToken)
        {
            var a = Request.Headers.Authorization;
            // We want to keep the controllers thin so the validation and error handling will hapen in the handlers
            return HandleResult<ActivityDto>(await Mediator.Send(new Details.Query { Id = id }, cancellationToken));
        }

        /// When returning IActionResult we have access to BadRequest() etc.
        /// Because it inherits from api controller the controller knows to look into the body
        /// we could give it a hint bu adding [FromBody]
        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity, CancellationToken cancellationToken)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Activity = activity }, cancellationToken));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity, CancellationToken cancellationToken)
        {
            activity.Id = id;

            return HandleResult(await Mediator.Send(new Edit.Command { Activity = activity }, cancellationToken));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command { Id = id }));
        }
    }
}