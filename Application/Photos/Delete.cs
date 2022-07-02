using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Photos
{
    public class Delete
    {
        // This is void because we do not need to return anything -> IRequest<Result<Unit>>
        // Result is a custom object of ours
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _context = context ?? throw new ArgumentNullException(nameof(context));
                _photoAccessor = photoAccessor ?? throw new ArgumentNullException(nameof(photoAccessor));
                _userAccessor = userAccessor ?? throw new ArgumentNullException(nameof(userAccessor));
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                .Include(p => p.Photos)
                .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername(), cancellationToken);

                if (user == null)
                    return null;

                //We have already retrieved the user and her photos so no need for async
                //Its in memory
                var photo = user.Photos.FirstOrDefault(p => p.Id == request.Id);
                if (photo == null)
                    return null;

                if (photo.IsMain)
                    return Result<Unit>.Failure("You cannot delete your main photo");

                var result = await _photoAccessor.DeletePhoto(photo.Id);
                if (result == null)
                    return Result<Unit>.Failure("Problem deleting photo from Cloudinary");

                // Could be soft deleted by marking isDeleted
                user.Photos.Remove(photo);

                var success = await _context.SaveChangesAsync(cancellationToken) > 0;

                if (success)
                    return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem deleting photo from API");
            }
        }
    }
}