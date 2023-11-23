using Dapper;
using infrastructure.DataModels;
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
            return conn.ExecuteScalar<int>("SELECT COUNT(*) FROM tennis_app.players WHERE full_name = @fullname AND player_id != @playerId;",
                new { fullname, playerId }) != 0;
        }
    }

    public Player CreatePlayer(string fullname, bool active)
    {
        var sql = $@"
INSERT INTO tennis_app.players (full_name, active) 
VALUES (@fullname, @active)
RETURNING 
    player_id as {nameof(Player.PlayerId)},
    full_name as {nameof(Player.FullName)},
    active as {nameof(Player.Active)};
";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.QueryFirst<Player>(sql, new { fullname, active });
        }
    }

    public Player UpdatePlayer(int playerId,string fullname, bool active)
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
}