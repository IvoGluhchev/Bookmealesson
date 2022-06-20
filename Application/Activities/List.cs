using MediatR;
using System.Collections.Generic;
using Persistance;
using Microsoft.EntityFrameworkCore;
using Domain;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace Application.Activities
{
    // Actually this should be ListActivities
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>> { }

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context ?? throw new ArgumentNullException(nameof(context));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                // by automapper projecting we get only the props we need
                var activities = await _context.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}