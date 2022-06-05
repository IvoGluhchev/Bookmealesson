using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
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

            public Handler(DataContext context)
            {
                _context = context ?? throw new ArgumentNullException(nameof(context));
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // The AddAsync is async when used only for db operations
                // Here we add the Activity in-memory of EF
                _context.Activities.Add(request.Activity);
                var result = await _context.SaveChangesAsync() > 0;
                if (!result)
                    return Result<Unit>.Failure("Failed to create activity");

                // Just indicating to the caller that this has finished
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}