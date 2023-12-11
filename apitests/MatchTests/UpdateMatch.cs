using System.Net.Http.Json;
using apitests.Models;
using Dapper;
using FluentAssertions;
using Newtonsoft.Json;
using NUnit.Framework;

namespace apitests.MatchTests;

[TestFixture]
public class UpdateMatch
{
    [TestCase("indoor", "clay", "2000-01-01", "2023-11-24T09:30:22.965Z", "2023-11-24T09:30:22.965Z", true, "some note", 1, 2)]
    public async Task MatchCanSuccessfullyBeUpdatedFromHttpRequest(string environment, string surface, DateTime date, DateTime startTime, DateTime endTime, bool finished, string notes, int playerId1, int playerId2)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            //Insert an match to be updated
            conn.Query(
                "INSERT INTO tennis_app.match (environment, surface, date, start_time, end_time, finished, notes) VALUES ('hardcodedOutdoor', 'hardcodedClay', '2001-01-01', '2001-01-02 10:10:10', '2001-01-03 11:11:11', true, 'hardcodedNote') RETURNING *;" +
                "insert into tennis_app.players(full_name)VALUES('Aleksandra Kurdelska');" +
                "insert into tennis_app.players(full_name)VALUES('Bob Pancakes');" +
                " INSERT INTO tennis_app.played_in (player_id, match_id) VALUES (1,1);" +
                "INSERT INTO tennis_app.played_in (player_id, match_id) VALUES (2,1)" +
                "");
        }

        var testMatch = new Match()
        {
            Id = 1, Environment = environment, Surface = surface, Date = date, StartTime = startTime, EndTime = endTime,
            Finished = finished, Notes = notes, PlayerId1 = playerId1, PlayerId2 = playerId2
        };

        //ACT
        var httpResponse = await new HttpClient().PutAsJsonAsync(Helper.ApiBaseUrl + "/matches/1", testMatch);
        var matchFromResponseBody =
            JsonConvert.DeserializeObject<Match>(await httpResponse.Content.ReadAsStringAsync());
        Console.WriteLine(matchFromResponseBody.Id);

        //ASSERT
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            var updatedMatch = conn.QueryFirst<Match>(
                "SELECT m.match_id as Id, m.environment as Environment, m.surface as Surface, m.date as Date, m.start_time as StartTime, m.end_time as EndTime, m.finished as Finished, m.notes as Notes, pi1.player_id as PlayerId1, pi2.player_id as PlayerId2, p1.full_name as FullNamePlayer1, p2.full_name as FullNamePlayer2 " +
                " FROM tennis_app.match m " +
                "INNER JOIN tennis_app.played_in pi1 ON m.match_id = pi1.match_id AND pi1.player_id = 1 " +
                "INNER JOIN tennis_app.played_in pi2 ON m.match_id = pi2.match_id AND pi2.player_id = 2 " +
                "INNER JOIN tennis_app.players p1 ON pi1.player_id = p1.player_id " +
                "INNER JOIN tennis_app.players p2 ON pi2.player_id = p2.player_id;");
                updatedMatch.Should().BeEquivalentTo(matchFromResponseBody);
        }
    }
}