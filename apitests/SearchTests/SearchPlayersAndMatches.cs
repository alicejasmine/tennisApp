using apitests.Models;
using Dapper;
using FluentAssertions;
using FluentAssertions.Execution;
using Newtonsoft.Json;
using NUnit.Framework;


namespace apitests.SearchTests;

public class SearchPlayersAndMatches
{
    [Test]
    [TestCase("Player")]
    [TestCase("player")]
    [TestCase("PLAYER")]
    [TestCase("01-01-2001")]
    public async Task SuccessfulSearchMatchesAndPlayers(string searchterm)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        int expectedMatchCount = 3;

//Inserts 3 players with full names Player1 through "Player3
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            for (int i = 1; i <= 3; i++)
            {
                conn.QueryFirst<Player>(
                    "INSERT INTO tennis_app.players(full_name) VALUES(@fullname) RETURNING *",
                    new { fullname = $"Player{i}" });
            }

//Inserts 3 players with full names Othername1 through Othername3
            for (int i = 1; i <= 3; i++)
            {
                conn.QueryFirst<Player>(
                    "INSERT INTO tennis_app.players(full_name) VALUES(@fullname) RETURNING *",
                    new { fullname = $"Othername{i}" });
            }
        }
//insert 5 matches with id 1,2,3...and setting the date of the test case for 3 of them

        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            for (int i = 1; i <= 5; i++)
            {
                conn.Execute(
                    "INSERT INTO tennis_app.match (match_id, environment, surface, date, start_time, end_time, finished, notes) VALUES (@matchId, 'outdoor', 'clay', @date, '2001-01-02 10:10:10', '2001-01-03 11:11:11', true, 'Notes on the match')",
                    new { matchId = i, date = i <= 3 ? new DateTime(2001, 1, 1) : new DateTime(2001, 1, 2) });

                //Associate players with the match through the played_in table
                conn.Execute(
                    "INSERT INTO tennis_app.played_in (match_id, player_id) VALUES (@matchId, @playerId)",
                    new { matchId = i, playerId = i });

                conn.Execute(
                    "INSERT INTO tennis_app.played_in (match_id, player_id) VALUES (@matchId, @playerId)",
                    new { matchId = i, playerId = i + 1 });
            }
        }

        //ACT
        var httpResponse =
            await new HttpClient().GetAsync(Helper.ApiBaseUrl + $"/matches/search?searchTerm={searchterm}");

        //ASSERT
        httpResponse.EnsureSuccessStatusCode();

        var matchesFromResponseBody =
            JsonConvert.DeserializeObject<IEnumerable<MatchWithPlayers>>(
                await httpResponse.Content.ReadAsStringAsync());

        using (new AssertionScope())
        {
            httpResponse.IsSuccessStatusCode.Should().BeTrue();
            matchesFromResponseBody.Should().HaveCount(expectedMatchCount);
        }
    }
}