using infrastructure.QueryModels;
using infrastructure.Repositories;

namespace service;

public class SearchService
{
    private readonly SearchRepository _searchRepository;
    
    public SearchService(SearchRepository searchRepository)
    {
        _searchRepository = searchRepository;
    }

    
    public IEnumerable<MatchWithPlayers> SearchMatchesAndPlayers(string searchTerm)
    {
        return _searchRepository.SearchMatchesAndPlayers(searchTerm);
    }
}