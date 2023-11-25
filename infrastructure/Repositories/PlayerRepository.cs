using Dapper;
using infrastructure.DataModels;
using infrastructure.QueryModels;
using Npgsql;

namespace infrastructure.Repositories;

public class PlayerRepository
{
    private NpgsqlDataSource _dataSource;

    public PlayerRepository(NpgsqlDataSource datasource)
    {
        _dataSource = datasource;
    }


    public bool IsFullNameTakenInCreate(string fullname)
    {
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.ExecuteScalar<int>("SELECT COUNT(*) FROM tennis_app.players WHERE full_name = @fullname;",
                new { fullname }) != 0;
        }
    }

/**/
    public bool IsFullNameTakenInUpdate(int playerId, string fullname)
    {
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.ExecuteScalar<int>(
                "SELECT COUNT(*) FROM tennis_app.players WHERE full_name = @fullname AND player_id != @playerId;",
                new { fullname, playerId }) != 0;
        }
    }

    public Player CreatePlayer(string fullname)
    {
        var sql = $@"
INSERT INTO tennis_app.players (full_name) 
VALUES (@fullname)
RETURNING 
    player_id as {nameof(Player.PlayerId)},
    full_name as {nameof(Player.FullName)};
    
";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.QueryFirst<Player>(sql, new { fullname});
        }
    }

    public Player UpdatePlayer(int playerId, string fullname, bool active)
    {
        var sql = $@"
UPDATE tennis_app.players SET full_name = @fullname, active = @active
WHERE player_id = @playerId     
RETURNING player_id as {nameof(Player.PlayerId)},
    full_name as {nameof(Player.FullName)},
       active as {nameof(Player.Active)};
   
";

        using (var conn = _dataSource.OpenConnection())
        {
            return conn.QueryFirst<Player>(sql, new { playerId, fullname, active });
        }
    }


    public Player GetPlayerById(int playerId)
    {
        var sql = $@"SELECT player_id as {nameof(Player.PlayerId)},
    full_name as {nameof(Player.FullName)},
       active as {nameof(Player.Active)} FROM tennis_app.players WHERE player_id = @playerId;";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.QueryFirst<Player>(sql, new { playerId });
        }
    }


    public IEnumerable<AllPlayers> GetAllPlayers(int page, int resultsPerPage)
    {
        string sql = $@"
SELECT player_id as {nameof(Player.PlayerId)},
       full_name as {nameof(Player.FullName)},
    active as {nameof(Player.Active)}

FROM tennis_app.players OFFSET @offset LIMIT @limit;
";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.Query<AllPlayers>(sql, new { offset = (page - 1) * resultsPerPage, limit = resultsPerPage });
        }
    }


    public IEnumerable<MatchesForPlayer> GetMatchesForPlayer(int playerId, int page, int resultsPerPage)
    {
        string sql = $@"
        SELECT  
            m.match_id as {nameof(MatchesForPlayer.Id)},
            m.environment as {nameof(MatchesForPlayer.Environment)},
            m.surface as {nameof(MatchesForPlayer.Surface)},
            m.date as {nameof(MatchesForPlayer.Date)},
            m.start_time as {nameof(MatchesForPlayer.StartTime)},
            m.end_time as {nameof(MatchesForPlayer.EndTime)},
            m.finished as {nameof(MatchesForPlayer.Finished)},
            m.notes as {nameof(MatchesForPlayer.Notes)}
        FROM tennis_app.match m
        JOIN tennis_app.played_in pi ON m.match_id = pi.match_id
        WHERE pi.player_id =@playerId
        ORDER BY m.date DESC, m.start_time DESC
        OFFSET @offset
        LIMIT @limit;
    ";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.Query<MatchesForPlayer>(sql,
                new { playerId, offset = (page - 1) * resultsPerPage, limit = resultsPerPage });
        }
    }
    
    
    public IEnumerable<SearchPlayerItem> GetPlayers(string searchTerm)
    {
        var sql = $@"
SELECT player_id as {nameof(SearchPlayerItem.PlayerId)},
       full_name as {nameof(SearchPlayerItem.FullName)}, 
       active as {nameof(SearchPlayerItem.Active)}
FROM tennis_app.players
WHERE lower(players.full_name) LIKE LOWER(@searchTerm);
";

        using (var conn = _dataSource.OpenConnection())
        {
            return conn.Query<SearchPlayerItem>(sql, 
                new {searchTerm = '%'+searchTerm+'%'});
        }

    }
}