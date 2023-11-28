using api.TransferModels;
using infrastructure.QueryModels;
using Microsoft.AspNetCore.Mvc;
using service;

namespace api.Controllers;

public class SearchController
{
    
    private readonly SearchService _searchService;
    
    public SearchController(SearchService searchService)
    {
        _searchService = searchService;
    }
    
    
    [HttpGet]
    [Route("/api/matches/search")]
    public IEnumerable<MatchWithPlayers> Get([FromQuery] SearchMatchesAndPlayersRequestDto dto)
    {
        return _searchService.SearchMatchesAndPlayers(dto.SearchTerm);
    }
}