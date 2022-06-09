using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string DisplayName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        /// <summary>
        /// (?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$
        /// should contain atleast 1 digit, atleast one a-z, atleast one A-Z, length should be b/n 4 & 8
        /// </summary>
        /// <value></value>
        [Required]
        [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$",
           ErrorMessage = "Password must be complex")]
        public string Password { get; set; }
        [Required]
        public string Username { get; set; }
    }
}