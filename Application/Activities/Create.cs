using Domain;
using MediatR;
using Persistance;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context ?? throw new ArgumentNullException(nameof(context));
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                // The AddAsync is async when used only for db operations
                // Here we add the Activity inmemory of EF
                _context.Activities.Add(request.Activity);
                await _context.SaveChangesAsync();

                // Just indicating to the caller that this has finished
                return Unit.Value;
            }
        }
    }
}