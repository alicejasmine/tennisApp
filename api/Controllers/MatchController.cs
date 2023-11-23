﻿using api.TransferModels;
using infrastructure.DataModels;
using infrastructure.QueryModels;
using Microsoft.AspNetCore.Mvc;
using service;

namespace api.Controllers;

public class MatchController:ControllerBase
{
    private readonly ILogger<MatchController> _logger;
    private readonly MatchService _matchService;

    public MatchController(ILogger<MatchController> logger, MatchService matchService)
    {
        _logger = logger;
        _matchService = matchService;
    }

    [HttpPost]
    [Route("/api/matches")]
    public Match Post([FromBody] CreateMatchRequestDto dto)
    {
        HttpContext.Response.StatusCode = StatusCodes.Status201Created;
        return _matchService.CreateMatch(dto.Environment, dto.Surface, dto.Date, dto.StartTime, dto.EndTime,
            dto.Finished, dto.Notes);
    }
    
    [HttpGet]
    [Route("/api/matches")]
    public IEnumerable<AllMatches> GetAllMatches()
    {
        return _matchService.GetAllMatches();
    }

    [HttpPut]
    [Route("/api/matches/{matchId}")]
    public Match Put([FromRoute] int matchId, [FromBody] UpdateMatchRequestDto dto)
    {
        return _matchService.UpdateMatch(matchId, dto.Environment, dto.Surface, dto.Date, dto.StartTime, dto.EndTime,
            dto.Finished, dto.Notes);
    }

    [HttpDelete]
    [Route("/api/matches/{matchId}")]
    public object Delete([FromRoute] int matchId)
    {
        _matchService.DeleteMatch(matchId);
        return new { message = "Match has been deleted" };
    }

    [HttpGet]
    [Route("/api/matches/{matchId}")]
    public Match Get([FromRoute] int matchId)
    {
        return _matchService.GetMatchById(matchId);
    }
}