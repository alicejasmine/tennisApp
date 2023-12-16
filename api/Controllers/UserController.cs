using api.Filters;
using Microsoft.AspNetCore.Mvc;
using service;
using service.BEservices;
using service.Models.Command;


namespace api.Controllers;

[RequireAuthentication]
public class UserController : ControllerBase
{
    private readonly UserService _userService;
    private readonly AccountService _accountService;
    public UserController(UserService userService, AccountService accountService)
    {
        _userService = userService;
        _accountService = accountService;
    }
    
    
    // get all users
    [RequireAuthentication]
    [HttpGet("/api/users")]
    public IActionResult Get()
    {
        return Ok(_userService.GetOverview());
    }
    
    //intended for use by admin to register another user
    [HttpPost]
    [Route("/api/users/register")]
    public IActionResult Register([FromBody] RegisterCommandModel model)
    {
        var user = _accountService.Register(model);
        return Created();
    }
    
    // intended to be used by admin/coach to update another user
    [HttpPut]
    [Route("/api/users/update/{id}")]
    public IActionResult Update([FromForm] UpdateUserCommandModel model, [FromRoute] int id)
    {
        model.Id = id;
        _userService.Update(model);
        return Ok();
    }
    
    // get user by id
    [HttpGet("/api/users/{id}")]
    public IActionResult Get(int id)
    {
       var user = _userService.GetDetails(id);
       return user != null ? Ok(user) : NotFound();
    }
}