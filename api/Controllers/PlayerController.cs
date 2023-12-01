using api.Filters;
using api.TransferModels;
using infrastructure.DataModels;
using infrastructure.QueryModels;
using Microsoft.AspNetCore.Mvc;
using service;

namespace api.Controllers;

public class PlayerController : ControllerBase
{
    private readonly PlayerService _playerService;

    public PlayerController(PlayerService playerService)
    {
        _playerService = playerService;
    }

    //Create player
    [HttpPost]
    [ValidateModel]
    [Route("/api/players")]
    public Player Post([FromBody] CreatePlayerRequestDto dto)
    {
        HttpContext.Response.StatusCode = StatusCodes.Status201Created;
        return _playerService.CreatePlayer(dto.FullName);
    }

    //Update player by id
    [HttpPut]
    [ValidateModel]
    [Route("/api/players/{playerId}")]
    public Player Put(
        [FromRoute] int playerId,
        [FromBody] UpdatePlayerRequestDto dto)
    {
        return
            _playerService.UpdatePlayer(playerId, dto.FullName, dto.Active);
    }


    //read player by id
    [HttpGet]
    [Route("/api/players/{playerId}")]
    public Player Get([FromRoute] int playerId)
    {
        return _playerService.GetPlayer(playerId);
    }

    //read all players

    [HttpGet]
    [Route("/api/players")]
    public IEnumerable<AllPlayers> GetAllPlayers()
    {
        return _playerService.GetAllPlayers();
    }

    //read all matches for a player

    [HttpGet]
    [Route("/api/matches/{playerId}")]
    public IEnumerable<MatchesForPlayer> GetMatchesForPlayer(int playerId, [FromQuery] int page,
        [FromQuery] int resultsPerPage)
    {
        return _playerService.GetMatchesForPlayer(playerId, page, resultsPerPage);
    }
    
    //search players
    
    [HttpGet]
    [Route("/api/players/search")]
    public IEnumerable<SearchPlayerItem> Get([FromQuery] SearchPlayerRequestDto dto)
    {
        return _playerService.SearchForPlayers(dto.SearchTerm);
    }
}