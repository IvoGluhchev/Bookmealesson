using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Activities
{
    // Our Create Handler
    public class Create
    {
        // Commands usually do not return value. Here we return Core Result of type Unit which is comming from mediator and is basically void
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                // We are creating a rule for our Command because it contains the Activity
                // and we are setting the validator to be ActivityValidator where we have the rules for Activity
                RuleFor(a => a.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context ?? throw new ArgumentNullException(nameof(context));
                _userAccessor = userAccessor ?? throw new ArgumentNullException(nameof(userAccessor));
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                var attenddee = new ActivityAttendee
                {
                    AppUser = user,
                    Activity = request.Activity,
                    IsHost = true
                };

                request.Activity.Attendees.Add(attenddee);

                // The AddAsync is async when used only for db operations
                // Here we add the Activity in-memory of EF
                _context.Activities.Add(request.Activity);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to create activity");

                // Just indicating to the caller that this has finished
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}