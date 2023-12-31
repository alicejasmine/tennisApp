using System.ComponentModel.DataAnnotations;
using infrastructure.DataModels;
using infrastructure.QueryModels;
using infrastructure.Repositories;

namespace service.BEservices;

public class PlayerService
{
    private readonly PlayerRepository _playerRepository;

    public PlayerService(PlayerRepository playerRepository)
    {
        _playerRepository = playerRepository;
    }

    public Player CreatePlayer(string fullname)
    {
        try
        {
            if (_playerRepository.IsFullNameTakenInCreate(fullname))
                throw new ValidationException("player name is taken");
            return _playerRepository.CreatePlayer(fullname);
        }
        catch (ValidationException e)
        {
            Console.WriteLine(e.Message);
            Console.WriteLine(e.InnerException?.Message);
            throw;
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            Console.WriteLine(e.InnerException?.Message);
            throw new Exception("Could not create a new player");
        }
    }

    public Player UpdatePlayer(int playerId, string fullname, bool active)
    {
        try
        {
            if (_playerRepository.IsFullNameTakenInUpdate(playerId, fullname))
                throw new ValidationException("Player fullname is taken");
            return _playerRepository.UpdatePlayer(playerId, fullname, active);
        }


        catch (ValidationException e)
        {
            Console.WriteLine(e.Message);
            Console.WriteLine(e.InnerException?.Message);
            throw;
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            Console.WriteLine(e.InnerException?.Message);
            throw new Exception("Could not update the player");
        }
    }

    public Player GetPlayer(int playerId)
    {
        return _playerRepository.GetPlayerById(playerId);
    }

    public IEnumerable<AllPlayers> GetAllPlayers()
    {
        return _playerRepository.GetAllPlayers();
    }


    public IEnumerable<MatchesForPlayer> GetMatchesForPlayer(int playerId)
    {
        return _playerRepository.GetMatchesForPlayer(playerId);
    }
    
    public IEnumerable<SearchPlayerItem> SearchForPlayers(string searchTerm)
    {
        return _playerRepository.GetPlayers(searchTerm);
    }
}