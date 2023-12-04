﻿namespace service.Models.Command;

public class CreateUserCommandModel
{
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public required bool IsAdmin { get; set; }
}