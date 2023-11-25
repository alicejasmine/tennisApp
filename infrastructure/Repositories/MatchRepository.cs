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
            DateTime endTime, bool finished, string notes, int playerId1, int playerId2)
        {
            var sql = $@"
-- Insert into match and get the match_id
    INSERT INTO tennis_app.match (environment, surface, date, start_time, end_time, finished, notes)
    VALUES (@environment, @surface, @date, @startTime, @endTime, @finished, @notes)
    RETURNING match_id as {nameof(Match.Id)},
    environment as {nameof(Match.Environment)},
    surface as {nameof(Match.Surface)},
     date as {nameof(Match.Date)},
      start_time as {nameof(Match.StartTime)},
      end_time as {nameof(Match.EndTime)},
     finished as {nameof(Match.Finished)},
      notes as {nameof(Match.Notes)}; -- This will return the match_id as the result set

-- Insert into played_in for playerId1
    INSERT INTO tennis_app.played_in (match_id, player_id)
    VALUES (LASTVAL(), @playerId1)
    RETURNING player_id as {nameof(Match.PlayerId1)}; -- Assumes that match_id is a serial column

-- Insert into played_in for playerId2
    INSERT INTO tennis_app.played_in (match_id, player_id)
    VALUES (LASTVAL(), @playerId2)
    RETURNING player_id as {nameof(Match.PlayerId2)};-- Assumes that match_id is a serial column
"; 

            using (var conn = _dataSource.OpenConnection())
            {
                return conn.QueryFirst<Match>(sql,
                    new { environment, surface, date, startTime, endTime, finished, notes, playerId1, playerId2 });
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