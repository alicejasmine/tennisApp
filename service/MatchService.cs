﻿using System.Data.SqlTypes;
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

    public Match CreateMatch(string environment, string surface, DateTime date, DateTime startTime,
        DateTime endTime, bool finished, string notes)
    {
        return _matchRepository.CreateMatch(environment, surface, date, startTime, endTime, finished, notes);
    }
    
    
    public IEnumerable<AllMatches> GetAllMatches()
    {
        return _matchRepository.GetAllMatches();
    }

    public Match UpdateMatch(int id, string environment, string surface, DateTime date, DateTime startTime,
        DateTime endTime, bool finished, string notes)
    {
        return _matchRepository.UpdateMatch(id, environment, surface, date, startTime, endTime, finished, notes);
    }

    public void DeleteMatch(int matchId)
    {
        var result = _matchRepository.DeleteMatch(matchId);
        if (!result)
        {
            throw new ArgumentException("Could not delete the match.");
        }
    }

    public Match GetMatchById(int matchId)
    {
        return _matchRepository.GetMatchById(matchId);
    }
}