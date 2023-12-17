using Dapper;
using infrastructure.DataModels;
using infrastructure.QueryModels;
using Npgsql;

namespace infrastructure.Repositories;

public class ShotsRepository
{
    private NpgsqlDataSource _dataSource;

    public ShotsRepository(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

  
    
    public IEnumerable<ShotListItem> GetPlayerShotsByMatch(int playerId, int matchId)
    {
        string sql = $@"
SELECT shots_id as {nameof(ShotListItem.ShotsId)},
match_id as {nameof(ShotListItem.MatchId)},
player_id as {nameof(ShotListItem.PlayerId)},
shot_classification as {nameof(ShotListItem.ShotClassification)},
shot_type as {nameof(ShotListItem.ShotType)},
shot_destination as {nameof(ShotListItem.ShotDestination)},
shot_direction as {nameof(ShotListItem.ShotDirection)},
player_position as {nameof(ShotListItem.PlayerPosition)}
FROM tennis_app.shots WHERE match_id = @mId AND player_id = @pId;
";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.Query<ShotListItem>(sql, new {pId = playerId, mId = matchId});
        }
    }
    
    public IEnumerable<ShotListItem> GetAllPlayerShots(int playerId)
    {
        string sql = $@"
SELECT shots_id as {nameof(ShotListItem.ShotsId)},
match_id as {nameof(ShotListItem.MatchId)},
player_id as {nameof(ShotListItem.PlayerId)},
shot_classification as {nameof(ShotListItem.ShotClassification)},
shot_type as {nameof(ShotListItem.ShotType)},
shot_destination as {nameof(ShotListItem.ShotDestination)},
shot_direction as {nameof(ShotListItem.ShotDirection)},
player_position as {nameof(ShotListItem.PlayerPosition)}
FROM tennis_app.shots WHERE player_id = @pId;
";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.Query<ShotListItem>(sql, new {pId = playerId});
        }
    }

    public Shot CreateShot(int playerId, int matchId, string shotClassification, string shotType, string shotDestination,
        string shotDirection, string playPosition)
    {
        var sql =
            $@"INSERT INTO tennis_app.shots (player_id, match_id, shot_classification, shot_type, shot_destination, shot_direction, player_position) 
VALUES (@playerId, @matchId, @shotClassification, @shotType, @shotDestination, @shotDirection, @playPosition)
RETURNING tennis_app.shots.shots_id as {nameof(Shot.ShotsId)},
player_id as {nameof(Shot.PlayerId)},
match_id as {nameof(Shot.MatchId)},
shot_classification as {nameof(Shot.ShotClassification)},
shot_type as {nameof(Shot.ShotType)},
shot_destination as {nameof(Shot.ShotDestination)},
shot_direction as {nameof(Shot.ShotDirection)},
player_position as {nameof(Shot.PlayerPosition)};
";

        using (var conn = _dataSource.OpenConnection())
        {
            return conn.QueryFirst<Shot>(sql,
                new { playerId, matchId, shotClassification, shotType, shotDestination, shotDirection, playPosition });
        }
    }
    
    public Shot GetShotById(int shotId)
    {
        string sql = $@"
SELECT shots_id as {nameof(ShotListItem.ShotsId)},
player_id as {nameof(ShotListItem.PlayerId)},
match_id as {nameof(ShotListItem.MatchId)},
shot_classification as {nameof(ShotListItem.ShotClassification)},
shot_type as {nameof(ShotListItem.ShotType)},
shot_destination as {nameof(ShotListItem.ShotDestination)},
shot_direction as {nameof(ShotListItem.ShotDirection)},
player_position as {nameof(ShotListItem.PlayerPosition)}
FROM tennis_app.shots WHERE shots_id = @shotId;
";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.QueryFirst<Shot>(sql, new { shotId });
        }
    }

    public bool DeleteShot(int shotId)
    {
        var sql = $@"DELETE FROM tennis_app.shots WHERE shots_id = @shotId;";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.Execute(sql, new { shotId }) == 1;
        }
    }

    public Shot UpdateShot(int shotId, int playerId, int matchId, string shotClass, string shotType, string shotDest,
        string shotDir, string playPos)
    {
        var sql = $@"UPDATE tennis_app.shots SET player_id = @playerId, match_id = @matchId, shot_classification = @shotclass,
                            shot_type = @shotClass, shot_destination = @shotDest, shot_direction = @shotDir, player_position = @playPos
WHERE shots_id = @shotId
RETURNING shots_id as {nameof(Shot.ShotsId)},
player_id as {nameof(Shot.PlayerId)},
match_id as {nameof(Shot.MatchId)},
shot_classification as {nameof(Shot.ShotClassification)},
shot_type as {nameof(Shot.ShotType)},
shot_destination as {nameof(Shot.ShotDestination)},
shot_direction as {nameof(Shot.ShotDirection)},
player_position as {nameof(Shot.PlayerPosition)};
";

        using (var conn = _dataSource.OpenConnection())
        {
            return conn.QueryFirst<Shot>(sql,
                new { playerId, matchId, shotClass, shotType, shotDest, shotDir, playPos });
        }
    }
}