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
            return conn.QueryFirst<Player>(sql,new { fullname, active });
        }
    }
}