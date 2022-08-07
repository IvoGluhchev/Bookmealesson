using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class UserFollowing
    {
        public string ObserverId { get; set; }

        /// <summary>
        /// The one who follows other user
        /// </summary>
        public AppUser Observer { get; set; }

        public string TargerId { get; set; }

        /// <summary>
        /// The one being Followed
        /// </summary>
        public AppUser Target { get; set; }



    }
}