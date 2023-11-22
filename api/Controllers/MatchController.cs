using api.Filters;
using api.TransferModels;
using infrastructure.QueryModels;
using Microsoft.AspNetCore.Mvc;
using service;

namespace api.Controllers;

public class MatchController : ControllerBase
{
    private readonly ILogger<MatchController> _logger;
    private readonly MatchService _matchService;

    public MatchController(ILogger<MatchController> logger, MatchService matchService)
    {
        _logger = logger;
        _matchService = matchService;
    }

    [HttpPost]
    [ValidateModel]
    [Route("/api/matches")]
    public ResponseDto Post([FromBody] CreateMatchRequestDto dto)
    {
        HttpContext.Response.StatusCode = StatusCodes.Status201Created;
        return new ResponseDto()
        {
            MessageToClient = "Successfully created a match!",
            ResponseData = _matchService.CreateMatch(dto.Environment, dto.Surface, dto.Date, dto.StartTime, dto.EndTime, dto.Finished,
                dto.Notes)
        };
    }

    [HttpGet]
    [Route("/api/matches")]
    public IEnumerable<AllMatches> GetAllMatches()
    {
        return _matchService.GetAllMatches();
    }
}