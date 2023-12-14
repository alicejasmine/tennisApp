using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace service.Models.Command;

public class RegisterCommandModel
{
    [Required] public required string FullName { get; set; }

    [Required] public required string Email { get; set; }

    [Required] [MinLength(8)] public required string Password { get; set; }
    
    [DefaultValue(false)] public bool IsAdmin { get; set; }
}