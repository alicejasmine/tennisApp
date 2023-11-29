using apitest.Models;
using apitests;
using Dapper;
using FluentAssertions;
using NUnit.Framework;

namespace apitest.MatchTests;

public class DeleteMatch
{
     
    [TestCase("indoor", "clay", "2023-11-23", "2023-11-23 19:14:12.965", "2023-11-23 19:14:12.965", true, "some note",
        1, 2)]
    public async Task MatchCanSuccessfullyBeDeletedFromHttpClient(string environment, string surface, DateTime date,
        DateTime startTime,
        DateTime endTime, bool finished, string notes, int playerId1, int playerId2)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.QueryFirst<Match>(
                "insert into tennis_app.players(full_name)VALUES('Aleksandra Kurdelska');" +
                "insert into tennis_app.players(full_name)VALUES('Bob Pancakes');" +
                "INSERT INTO tennis_app.match (environment, surface, date, start_time, end_time, finished, notes) VALUES (@environment, @surface, @date, @startTime, @endTime, @finished, @notes)  RETURNING *;" +
                "INSERT INTO tennis_app.played_in (match_id, player_id) VALUES (LASTVAL(), @playerId1);" +
                "INSERT INTO tennis_app.played_in (match_id, player_id) VALUES (LASTVAL(), @playerId2);", new { environment, surface, date, startTime, endTime, finished, notes, playerId1, playerId2 });
        }

        //ACT
        var httpResponse = await new HttpClient().DeleteAsync(Helper.ApiBaseUrl + "/matches/1");
        
        //ASSERT
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            httpResponse.Should().BeSuccessful();
            conn.ExecuteScalar<int>("SELECT COUNT(*) FROM tennis_app.match;").Should().Be(0);
            conn.ExecuteScalar<int>("SELECT COUNT(*) FROM tennis_app.played_in").Should().Be(0);
        }
    }
}