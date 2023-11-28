using Dapper;
using infrastructure.DataModels;
using infrastructure.QueryModels;
using Npgsql;

namespace infrastructure.Repositories;

public class MatchRepository
{
    private NpgsqlDataSource _dataSource;

    public MatchRepository(NpgsqlDataSource datasource)
    {
        _dataSource = datasource;
    }

    public MatchWithPlayers CreateMatch(string environment, string surface, DateTime date, DateTime startTime,
        DateTime endTime, bool finished, string notes, int playerId1, int playerId2)
    {
        var sql = $@"
    INSERT INTO tennis_app.match (environment, surface, date, start_time, end_time, finished, notes)
    VALUES (@environment, @surface, @date, @startTime, @endTime, @finished, @notes)
    RETURNING match_id as {nameof(MatchWithPlayers.Id)},
    environment as {nameof(MatchWithPlayers.Environment)},
    surface as {nameof(MatchWithPlayers.Surface)},
     date as {nameof(MatchWithPlayers.Date)},
      start_time as {nameof(MatchWithPlayers.StartTime)},
      end_time as {nameof(MatchWithPlayers.EndTime)},
     finished as {nameof(MatchWithPlayers.Finished)},
      notes as {nameof(MatchWithPlayers.Notes)}; 

    INSERT INTO tennis_app.played_in (match_id, player_id)
    VALUES (LASTVAL(), @playerId1)
    RETURNING player_id as {nameof(MatchWithPlayers.PlayerId1)};

    INSERT INTO tennis_app.played_in (match_id, player_id)
    VALUES (LASTVAL(), @playerId2)
    RETURNING player_id as {nameof(MatchWithPlayers.PlayerId2)};
";

        using (var conn = _dataSource.OpenConnection())
        {
            return conn.QueryFirst<MatchWithPlayers>(sql,
                new { environment, surface, date, startTime, endTime, finished, notes, playerId1, playerId2 });
        }
    }

    public IEnumerable<MatchWithPlayers> GetAllMatchesWithPlayers()
    {
        var sql = $@"
        SELECT
       m.match_id as {nameof(MatchWithPlayers.Id)},
        m.environment as {nameof(MatchWithPlayers.Environment)},
        m.surface as {nameof(MatchWithPlayers.Surface)},
        m.date as {nameof(MatchWithPlayers.Date)},
        m.start_time as {nameof(MatchWithPlayers.StartTime)},
        m.end_time as {nameof(MatchWithPlayers.EndTime)},
        m.finished as {nameof(MatchWithPlayers.Finished)},
        m.notes as {nameof(MatchWithPlayers.Notes)},
        pi.player_id
        FROM tennis_app.match m
        JOIN tennis_app.played_in pi ON m.match_id = pi.match_id;
        ";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.Query<MatchWithPlayers>(sql);
        }
    }

    public Match UpdateMatch(int id, string environment, string surface, DateTime date, DateTime startTime,
        DateTime endTime, bool finished, string notes)
    {
        var sql = $@"
            UPDATE tennis_app.match SET environment = @environment, surface = @surface, date = @date, start_time = @startTime, end_time = @endTime, finished = @finished, notes = @notes
            WHERE match_id = @id
            RETURNING  match_id as {nameof(Match.Id)},
        environment as {nameof(Match.Environment)},
        surface as {nameof(Match.Surface)},
        date as {nameof(Match.Date)},
        start_time as {nameof(Match.StartTime)},
        end_time as {nameof(Match.EndTime)},
        finished as {nameof(Match.Finished)},
        notes as {nameof(Match.Notes)};
";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.QueryFirst<Match>(sql,
                new { id, environment, surface, date, startTime, endTime, finished, notes });
        }
    }

    public bool DeleteMatch(int matchId)
    {
        var sql = @"DELETE FROM tennis_app.match WHERE match_id = @matchId;";

        using (var conn = _dataSource.OpenConnection())
        {
            return conn.Execute(sql, new { matchId }) == 1;
        }
    }

    public IEnumerable<MatchWithOnePlayer> GetMatchById(int matchId)
    {
        var sql = $@"SELECT m.match_id as {nameof(MatchWithOnePlayer.Id)},
        m.environment as {nameof(MatchWithOnePlayer.Environment)},
        m.surface as {nameof(MatchWithOnePlayer.Surface)},
        m.date as {nameof(MatchWithOnePlayer.Date)},
        m.start_time as {nameof(MatchWithOnePlayer.StartTime)},
        m.end_time as {nameof(MatchWithOnePlayer.EndTime)},
        m.finished as {nameof(MatchWithOnePlayer.Finished)},
        m.notes as {nameof(MatchWithOnePlayer.Notes)},
        pi.player_id as {nameof(MatchWithOnePlayer.PlayerId)}
        FROM tennis_app.match m 
        JOIN tennis_app.played_in pi ON m.match_id = pi.match_id
        WHERE m.match_id = @matchId;
        ";
    

    using (var conn = _dataSource.OpenConnection())
        {
            return conn.Query<MatchWithOnePlayer>(sql, new { matchId });
        }
    }
}