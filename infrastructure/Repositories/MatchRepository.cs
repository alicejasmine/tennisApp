using System.Data.SqlTypes;
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
                return conn.QueryFirst<Match>(sql,
                    new { environment, surface, date, startTime, endTime, finished, notes });
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

        public Match UpdateMatch(int id, string environment, string surface, DateTime date, DateTime startTime,
            DateTime endTime, bool finished, string notes)
        {
            var sql = $@"
            UPDATE tennis_app.match SET environment = @environment, surface = @surface, date = @date, start_time = @startTime, end_time = @endTime, finished = @finished, notes = @notes
            WHERE match_id = @id
            RETURNING  match_id as {nameof(AllMatches.Id)},
        environment as {nameof(AllMatches.Environment)},
        surface as {nameof(AllMatches.Surface)},
        date as {nameof(AllMatches.Date)},
        start_time as {nameof(AllMatches.StartTime)},
        end_time as {nameof(AllMatches.EndTime)},
        finished as {nameof(AllMatches.Finished)},
        notes as {nameof(AllMatches.Notes)};";

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

        public Match GetMatchById(int matchId)
        {
            var sql = $@"SELECT match_id as {nameof(AllMatches.Id)},
        environment as {nameof(AllMatches.Environment)},
        surface as {nameof(AllMatches.Surface)},
        date as {nameof(AllMatches.Date)},
        start_time as {nameof(AllMatches.StartTime)},
        end_time as {nameof(AllMatches.EndTime)},
        finished as {nameof(AllMatches.Finished)},
        notes as {nameof(AllMatches.Notes)}
        FROM tennis_app.match WHERE match_id = @matchId;";

            using (var conn = _dataSource.OpenConnection())
            {
                return conn.QueryFirst<Match>(sql, new {matchId});
            }
        }
}