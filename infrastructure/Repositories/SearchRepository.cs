using Dapper;
using infrastructure.QueryModels;
using Npgsql;

namespace infrastructure.Repositories;

public class SearchRepository
{
    private NpgsqlDataSource _dataSource;

    public SearchRepository(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }
    
    
    
    
    public IEnumerable<MatchWithPlayers> SearchMatchesAndPlayers(string searchterm)
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
      p1.player_id as {nameof(MatchWithPlayers.PlayerId1)},
    p2.player_id as {nameof(MatchWithPlayers.PlayerId2)},
    p1.full_name as {nameof(MatchesForPlayer.FullNamePlayer1)},
    p2.full_name as {nameof(MatchesForPlayer.FullNamePlayer2)}

    FROM tennis_app.match m
         
INNER JOIN tennis_app.played_in pi1 ON m.match_id = pi1.match_id
INNER JOIN tennis_app.players p1 ON pi1.player_id = p1.player_id
INNER JOIN tennis_app.played_in pi2 ON m.match_id = pi2.match_id AND pi2.player_id != pi1.player_id
INNER JOIN tennis_app.players p2 ON pi2.player_id = p2.player_id
                                                
        WHERE LOWER(p1.full_name) LIKE LOWER(@searchterm) OR LOWER(p2.full_name) LIKE LOWER(@searchterm)
            OR TO_CHAR(m.date, 'DD-MM-YYYY') LIKE (@searchterm);";

        
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.Query<MatchWithPlayers>(sql, 
                new {searchTerm = '%'+searchterm+'%'});
        }

    }

}