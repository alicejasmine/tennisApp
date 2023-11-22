
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

    public Match CreateMatch(string environment, string surface, string date, string startTime,
        string endTime, bool finished, string notes)
    {
        var sql = $@"
        INSERT INTO tennis_app.match (environment, surface, date, start_time, end_time, finished, notes)
        VALUES(@environment, @surface, @date, @startTime, @endTime, @finished, @notes)
        RETURNING match_id as {nameof(Match.Id)},
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
            return conn.QueryFirst<Match>(sql, new { environment, surface, date, startTime, endTime, finished, notes });
        }
    }

    public IEnumerable<AllMatches> GetAllMatches()
    {
        var sql = $@"
        SELECT
       match_id as {nameof(AllMatches.Id)},
        environment as {nameof(AllMatches.Environment)},
        surface as {nameof(AllMatches.Surface)},
        date as {nameof(AllMatches.Date)},
        start_time as {nameof(AllMatches.StartTime)},
        end_time as {nameof(AllMatches.EndTime)},
        finished as {nameof(AllMatches.Finished)},
        notes as {nameof(AllMatches.Notes)}
        FROM tennis_app.match;
        ";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.Query<AllMatches>(sql);
        }
    }
}