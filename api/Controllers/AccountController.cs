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
    
    [HttpPost]
    [Route("/api/account/login")]
    public ResponseDto Login([FromBody] LoginCommandModel model)
    {
        var user = _accountService.Authenticate(model);
        var token = _jwtService.IssueToken(SessionData.FromUser(user!));
        return new ResponseDto
        {
            MessageToClient = "Successfully authenticated",
            ResponseData = new { token }
        };
    }
    
    
    [HttpPost]
    [Route("/api/account/register")]
    public IActionResult Register([FromBody] RegisterCommandModel model)
    {
        var user = _accountService.Register(model);
        return Created();
    }
    
    [RequireAuthentication]
    [HttpGet]
    [Route("/api/account/info")]
    public IActionResult AccInfo()
    {
        var data = HttpContext.GetSessionData();
        var user = _accountService.Get(data);
        return Ok(user);
    }
    
}