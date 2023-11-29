using api.Filters;
using Microsoft.AspNetCore.Mvc;
using service;

namespace api.Controllers;

[RequireAuthentication]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
    }
    
    

    [HttpGet("/api/users/{id}")]
    public IActionResult Get(int id)
    {
       var user = _userService.GetDetails(id);
       return user != null ? Ok(user) : NotFound();

    }
}