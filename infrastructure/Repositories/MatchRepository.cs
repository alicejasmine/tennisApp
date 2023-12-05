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

    public Match CreateMatch(string environment, string surface, DateTime date, DateTime startTime,
        DateTime endTime, bool finished, string notes)
    {
        var sql = $@"
    INSERT INTO tennis_app.match (environment, surface, date, start_time, end_time, finished, notes)
    VALUES (@environment, @surface, @date, @startTime, @endTime, @finished, @notes)
    RETURNING match_id as {nameof(Match.Id)},
    environment as {nameof(Match.Environment)},
    surface as {nameof(Match.Surface)},
     date as {nameof(Match.Date)},
      start_time as {nameof(Match.StartTime)},
      end_time as {nameof(Match.EndTime)},
     finished as {nameof(Match.Finished)},
      notes as {nameof(Match.Notes)};";

        using (var conn = _dataSource.OpenConnection())
        {
            return conn.QueryFirst<Match>(sql,
                new { environment, surface, date, startTime, endTime, finished, notes});
        }
    }
    
    public bool AddPlayersToMatch(int playerId, int matchId)
    {
        var sql = @"
        INSERT INTO tennis_app.played_in (match_id, player_id)
            VALUES (@matchId, @playerId);";
        
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.Execute(sql, new { matchId, playerId }) > 0;
        }
    }

    public IEnumerable<MatchWithPlayers> GetAllMatchesWithPlayers()
    {
        var sql = $@"
        SELECT DISTINCT ON (m.match_id)
       m.match_id as {nameof(MatchWithPlayers.Id)},
        m.environment as {nameof(MatchWithPlayers.Environment)},
        m.surface as {nameof(MatchWithPlayers.Surface)},
        m.date as {nameof(MatchWithPlayers.Date)},
        m.start_time as {nameof(MatchWithPlayers.StartTime)},
        m.end_time as {nameof(MatchWithPlayers.EndTime)},
        m.finished as {nameof(MatchWithPlayers.Finished)},
        m.notes as {nameof(MatchWithPlayers.Notes)},
        pi1.player_id as {nameof(MatchWithPlayers.PlayerId1)},
        pi2.player_id as {nameof(MatchWithPlayers.PlayerId2)},
        p1.full_name as {nameof(MatchWithPlayers.FullNamePlayer1)},
        p2.full_name as {nameof(MatchWithPlayers.FullNamePlayer2)}
        FROM tennis_app.match m
        INNER JOIN tennis_app.played_in pi1 ON m.match_id = pi1.match_id
        INNER JOIN tennis_app.players p1 ON pi1.player_id = p1.player_id
        INNER JOIN tennis_app.played_in pi2 ON m.match_id = pi2.match_id AND pi2.player_id != pi1.player_id
        INNER JOIN tennis_app.players p2 ON pi2.player_id = p2.player_id;
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

    public IEnumerable<MatchWithPlayers> GetMatchById(int matchId)
    {
        var sql = $@"SELECT DISTINCT ON (m.match_id)
    m.match_id as {nameof(MatchWithPlayers.Id)},
        m.environment as {nameof(MatchWithPlayers.Environment)},
        m.surface as {nameof(MatchWithPlayers.Surface)},
        m.date as {nameof(MatchWithPlayers.Date)},
        m.start_time as {nameof(MatchWithPlayers.StartTime)},
        m.end_time as {nameof(MatchWithPlayers.EndTime)},
        m.finished as {nameof(MatchWithPlayers.Finished)},
        m.notes as {nameof(MatchWithPlayers.Notes)},
        pi1.player_id as {nameof(MatchWithPlayers.PlayerId1)},
        pi2.player_id as {nameof(MatchWithPlayers.PlayerId2)},
        p1.full_name as {nameof(MatchWithPlayers.FullNamePlayer1)},
        p2.full_name as {nameof(MatchWithPlayers.FullNamePlayer2)}
          FROM tennis_app.match m
        INNER JOIN tennis_app.played_in pi1 ON m.match_id = pi1.match_id
        INNER JOIN tennis_app.players p1 ON pi1.player_id = p1.player_id
        INNER JOIN tennis_app.played_in pi2 ON m.match_id = pi2.match_id AND pi2.player_id != pi1.player_id
        INNER JOIN tennis_app.players p2 ON pi2.player_id = p2.player_id
        WHERE m.match_id = @matchId;
        ";
    

    using (var conn = _dataSource.OpenConnection())
        {
            return conn.Query<MatchWithPlayers>(sql, new { matchId });
        }
    }
}