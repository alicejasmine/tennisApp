namespace service.Models.Command;

public class UpdateUserCommandModel
{
    public required int Id { get; set; }
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public required bool IsAdmin { get; set; }
}