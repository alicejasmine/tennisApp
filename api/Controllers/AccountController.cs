using Microsoft.AspNetCore.Mvc;
using service;
using service.Models.Command;


namespace api.Controllers;


[ApiController]
public class AccountController : ControllerBase
{
    private readonly AccountService _accountService;
    
    /*
    public AccountController(AccountService accountService)
    {
        _accountService = accountService;
    }
    
    [HttpPost]
    [Route("/api/account/login")]
    public IActionResult Login([FromBody] LoginCommandModel model)
    {
        var user = _accountService.Authenticate(model);
        if (user == null) return Unauthorized();
        var token = _jwtService.IssueToken(SessionData.FromUser(user!));
        return Ok(new { token });
    }
    
    [HttpPost]
    [Route("/api/account/register")]
    public IActionResult Register([FromBody] RegisterCommandModel model)
    {
        var user = _accountService.Register(model);
        return Created();
    }
    */
}