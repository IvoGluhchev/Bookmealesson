namespace Domain
{
    // Not going to have validation via attributes here the validation will be
    // in the Application Layer and not in the domain layer
    public class Activity
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
       public bool IsCancelled { get; set; }
        public ICollection<ActivityAttendee> Attendees { get; set; } = new List<ActivityAttendee>();
        // public ICollection<Comment> Comments { get; set; } = new List<Comment>();

        public void UpdateFrom(Activity input)
        {
            this.Title = input?.Title ?? this.Title;
            this.Date = input?.Date ?? this.Date;
            this.Description = input?.Description ?? this.Description;
            this.Category = input?.Category ?? this.Category;
            this.City = input?.City ?? this.City;
            this.Venue = input?.Venue ?? this.Venue;
        }
    }
}