using infrastructure.DataModels;
using infrastructure.QueryModels;
using infrastructure.Repositories;

namespace service;

public class ShotService
{
    private readonly ShotsRepository _shotsRepository;

    public ShotService(ShotsRepository shotsRepository)
    {
        _shotsRepository = shotsRepository;
    }

    public IEnumerable<ShotListItem> GetShotsForPlayerByMatch(int playerId, int matchId)
    {
        return _shotsRepository.GetPlayerShotsByMatch(playerId, matchId);
    }

    public IEnumerable<ShotListItem> GetAllShotsByPlayer(int playerId)
    {
        return _shotsRepository.GetAllPlayerShots(playerId);
    }

    public Shot CreateShot(int playerId, int matchId, string shotClass, string shotType, string shotDest,
        string shotDir, string playerPos)
    {
        return _shotsRepository.CreateShot(playerId, matchId, shotClass, shotType, shotDest, shotDir, playerPos);
    }

    public Shot UpdateShot(int shotId, int playerId, int matchId, string shotClass, string shotType, string shotDest,
        string shotDir, string playerPos)
    {
        return _shotsRepository.UpdateShot(shotId, playerId, matchId, shotClass, shotType, shotDest, shotDir,
            playerPos);
    }

    public void DeleteShot(int shotId)
    {
        var result = _shotsRepository.DeleteShot(shotId);
        if (!result)
        {
            throw new ArgumentException("Could not delete Shot");
        }
    }

    public Shot GetShot(int shotId)
    {
        return _shotsRepository.GetShotById(shotId);
    }
}