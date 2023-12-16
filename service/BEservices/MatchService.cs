using infrastructure.DataModels;
using infrastructure.QueryModels;
using infrastructure.Repositories;

namespace service.BEservices;

public class MatchService
{
    private readonly MatchRepository _matchRepository;
    private readonly PlayerRepository _playerRepository;

    public MatchService(MatchRepository matchRepository, PlayerRepository playerRepository)
    {
        _matchRepository = matchRepository;
        _playerRepository = playerRepository;
    }

    public MatchWithPlayers CreateMatch(string environment, string surface, DateTime date, DateTime startTime,
        DateTime endTime, bool finished, string notes, int playerId1, int playerId2)
    {
        MatchWithPlayers createdMatchWithPlayers = new MatchWithPlayers();
        var createdMatch =
            _matchRepository.CreateMatch(environment, surface, date, startTime, endTime, finished, notes);
        var assignedPlayer1 = _matchRepository.AddPlayersToMatch(playerId1, createdMatch.Id);
        var assignedPlayer2 = _matchRepository.AddPlayersToMatch(playerId2, createdMatch.Id);
        var fullName1 = _playerRepository.GetPlayerById(playerId1);
        var fullName2 = _playerRepository.GetPlayerById(playerId2);
        if (assignedPlayer1 || assignedPlayer2)
        {
            createdMatchWithPlayers = new MatchWithPlayers()
            {
                Id = createdMatch.Id, Environment = environment, Surface = surface, Date = date, StartTime = startTime,
                EndTime = endTime, Finished = finished, Notes = notes, PlayerId1 = playerId1, PlayerId2 = playerId2, FullNamePlayer1 = fullName1.FullName, FullNamePlayer2 = fullName2.FullName
            };
        }
        
        return createdMatchWithPlayers;

    }
    
    
    public IEnumerable<MatchWithPlayers> GetAllMatchesWithPlayers()
    {
        return _matchRepository.GetAllMatchesWithPlayers();
    }

    public MatchWithPlayers UpdateMatch(int id, string environment, string surface, DateTime date, DateTime startTime,
        DateTime endTime, bool finished, string notes, int playerId1, int playerId2)
    {
        MatchWithPlayers updatedMatchWithPlayers = new MatchWithPlayers();
        var updatedMatch = _matchRepository.UpdateMatch(id, environment, surface, date, startTime, endTime, finished, notes);
        var fullName1 = _playerRepository.GetPlayerById(playerId1);
        var fullName2 = _playerRepository.GetPlayerById(playerId2);

        
            updatedMatchWithPlayers = new MatchWithPlayers()
            {
                Id = updatedMatch.Id, Environment = environment, Surface = surface, Date = date, StartTime = startTime,
                EndTime = endTime, Finished = finished, Notes = notes, PlayerId1 = playerId1, PlayerId2 = playerId2, FullNamePlayer1 = fullName1.FullName, FullNamePlayer2 = fullName2.FullName
            };
        
        
        return updatedMatchWithPlayers;
        
        
    }

    public void DeleteMatch(int matchId)
    {
        var result = _matchRepository.DeleteMatch(matchId);
        if (!result)
        {
            throw new ArgumentException("Could not delete the match.");
        }
    }

    public MatchWithPlayers GetMatchById(int matchId)
    {
        return _matchRepository.GetMatchById(matchId);
    }
}