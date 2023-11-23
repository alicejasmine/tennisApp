using infrastructure.DataModels;
using infrastructure.Repositories;

namespace service;

public class PlayerService
{
    
    private readonly PlayerRepository _playerRepository;

    public PlayerService(PlayerRepository playerRepository )
    {
        _playerRepository = playerRepository;
    }
    public Player CreatePlayer(string fullname, bool active)
    {
      
            return _playerRepository.CreatePlayer(fullname,active);
      

        }
}