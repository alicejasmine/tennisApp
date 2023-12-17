using api.Filters;
using api.TransferModels.Validation;
using Microsoft.AspNetCore.Mvc;
using service;
using service.Models.Command;


namespace api.Controllers;

[ValidateModel]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly AccountService _accountService;
    private readonly JwtService _jwtService;
    
    public AccountController(AccountService accountService, JwtService jwtService)
    {
        _accountService = accountService;
        _jwtService = jwtService;
    }
    
    // method to login, issues a bearer token for the user and sets our session data.
    // if for some reason the user does not exist or credentials are incorrect, we return unauthorized.
    [HttpPost]
    [Route("/api/account/login")]
    public IActionResult Login([FromBody] LoginCommandModel model)
    {
        var user = _accountService.Authenticate(model);
        if (user == null) return Unauthorized();
        var token = _jwtService.IssueToken(SessionData.FromUser(user!));
        return Ok(new { token });
    }
    
    // public access to create a new user account, this will always default admin status to false.
    [HttpPost]
    [Route("/api/account/register")]
    public IActionResult Register([FromBody] RegisterCommandModel model)
    {
        var user = _accountService.Register(model);
        return Created();
    }
    
    // for accessing the users own info can also be used to check if an account is logged in
    // if session data is null it will return no context, meaning user data does not exist.
    [HttpGet]
    [Route("/api/account/info")]
    public IActionResult AccInfo()
    {
        
        var data = HttpContext.GetSessionData();
        if (data == null) return NoContent();
        var user = _accountService.Get(data);
        return Ok(user);
    }
    
    // this is used to allow the user to update their own account through the account route.
    [RequireAuthentication]
    [HttpPut]
    [Route("/api/account/update")]
    public IActionResult Update([FromForm] UpdateAccountCommandModel model)
    {
        
        var session = HttpContext.GetSessionData()!;
        _accountService.Update(session, model);
        return Ok();
    }
    
}