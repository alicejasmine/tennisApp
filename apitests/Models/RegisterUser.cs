

namespace apitests.Models;

public class RegisterUser
{
    public required string FullName { get; set; }

    public required string Email { get; set; }

    public required string Password { get; set; }
}