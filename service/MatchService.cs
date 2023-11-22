using System.Data.SqlTypes;
using infrastructure.DataModels;
using infrastructure.QueryModels;
using infrastructure.Repositories;

namespace service;

public class MatchService
{
    private readonly MatchRepository _matchRepository;

    public MatchService(MatchRepository matchRepository)
    {
        _matchRepository = matchRepository;
    }

    public Match CreateMatch(string environment, string surface, string date, string startTime,
        string endTime, bool finished, string notes)
    {
        return _matchRepository.CreateMatch(environment, surface, date, startTime, endTime, finished, notes);
    }

    public IEnumerable<AllMatches> GetAllMatches()
    {
        return _matchRepository.GetAllMatches();
    }
}
