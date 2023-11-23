using api.TransferModels;
using infrastructure.DataModels;
using Microsoft.AspNetCore.Mvc;
using service;

namespace api.Controllers;

public class PlayerController:ControllerBase
{
    private readonly PlayerService _playerService;

    public PlayerController(PlayerService playerService)
    {
        _playerService = playerService;
    }
  
    //Create player
    [HttpPost]
    [Route("/api/players")]
    public Player Post([FromBody] CreatePlayerRequestDto dto)
    {
        HttpContext.Response.StatusCode = StatusCodes.Status201Created;
        return _playerService.CreatePlayer(dto.FullName,dto.Active);
    }
    
   
}