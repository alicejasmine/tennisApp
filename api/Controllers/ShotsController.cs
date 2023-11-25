using api.TransferModels.ShotDtos;
using infrastructure.DataModels;
using infrastructure.QueryModels;
using Microsoft.AspNetCore.Mvc;
using service;

namespace api.Controllers;

[ApiController]
[Route("[controller]")]
public class ShotsController : ControllerBase
{
    private readonly ShotService _shotService;

    public ShotsController(ShotService shotService)
    {
        _shotService = shotService;
    } 

    [HttpGet]
    [Route("/api/shots/{playerId}/{matchId}/shots")]
    public IEnumerable<ShotListItem> Get([FromRoute] int playerId, [FromRoute] int matchId )
    {
        return _shotService.GetShotsForPlayerByMatch(playerId, matchId);
    }
    
    [HttpGet]
    [Route("/api/shots/{playerId}/matches/shots")]
    public IEnumerable<ShotListItem> Get([FromRoute] int playerId)
    {
        return _shotService.GetAllShotsByPlayer(playerId);
    }

    [HttpPost]
    [Route("/api/shots/{playerId}/{matchId}/shots")]
    public Shot Post([FromBody] CreateShotRequestDto dto, [FromRoute] int playerId, [FromRoute] int matchId)
    {
        HttpContext.Response.StatusCode = StatusCodes.Status201Created;
        return _shotService.CreateShot(playerId, matchId, dto.ShotClassification, dto.ShotType, dto.ShotDestination,
            dto.ShotDirection, dto.PlayerPosition);
    }
    
    
}
