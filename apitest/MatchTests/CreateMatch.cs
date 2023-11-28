using System.Net;
using System.Net.Http.Json;
using apitest.Models;
using Dapper;
using FluentAssertions;
using Newtonsoft.Json;
using NUnit.Framework;

namespace apitest.MatchTests;

[TestFixture]
public class CreateMatch
{
    [TestCase("indoor", "clay", "2023-11-23", "2023-11-23 19:14:12.965", "2023-11-23 19:14:12.965", true, "some note",
        1, 2)]
    [TestCase("outdoor", "hard", "2023-11-23", "2023-11-23 19:14:12.965", "2023-11-23 19:14:12.965", true, "some note",
        1, 2)]
    public async Task MatchCanSuccessfullyBeCreatedFromHttpRequest(string environment, string surface, DateTime date,
        DateTime startTime,
        DateTime endTime, bool finished, string notes, int playerId1, int playerId2)
    {
        //ARRANGE
        Helper.TriggerRebuild();

        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.Query(
                "insert into tennis_app.players(full_name)VALUES('Aleksandra Kurdelska');" +
                "insert into tennis_app.players(full_name)VALUES('Bob Pancakes');");
        }

        var testMatch = new Match()
        {
            Id = 1, Environment = environment, Surface = surface, Date = date, StartTime = startTime, EndTime = endTime,
            Finished = finished, Notes = notes, PlayerId1 = playerId1, PlayerId2 = playerId2
        };

        //ACT
        var httpResponse = await new HttpClient().PostAsJsonAsync(Helper.ApiBaseUrl + "/matches", testMatch);
        var matchFromResponseBody =
            JsonConvert.DeserializeObject<Match>(await httpResponse.Content.ReadAsStringAsync());


        //ASSERT
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            var resultMatchAndPlayers = conn.QueryFirst<Match>(
                "SELECT match_id as Id, environment as Environment, surface as Surface, date as Date, start_time as StartTime, end_time as EndTime, finished as Finished, notes as Notes FROM tennis_app.match; SELECT player_id as PlayerId1 FROM tennis_app.played_in WHERE player_id = 1 AND match_id=1; SELECT player_id as PlayerId1 FROM tennis_app.played_in WHERE player_id = 2 AND match_id=1;");
            resultMatchAndPlayers.Should().BeEquivalentTo(matchFromResponseBody); //Should be equal to match found in DB
        }


    }



    //Here we're testing that the API returns a bad request response and no match is created when bad values are sent
    [TestCase("indoorrrrrr", "clay", "2000-01-01", "2023-11-24T09:30:22.965Z", "2023-11-24T09:30:22.965Z", true,
        "some note", 1, 2)]
    public async Task ServerSideDataValidationShouldRejectBadValues(string environment, string surface, DateTime date,
        DateTime startTime, DateTime endTime, bool finished, string notes, int playerId1, int playerId2)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.Query(
                "insert into tennis_app.players(full_name)VALUES('Aleksandra Kurdelska');" +
                "insert into tennis_app.players(full_name)VALUES('Bob Pancakes');");
        }

        var testMatch = new Match()
        {
            Id = 1, Environment = environment, Surface = surface, Date = date, StartTime = startTime, EndTime = endTime,
            Finished = finished, Notes = notes, PlayerId1 = playerId1, PlayerId2 = playerId2
        };
        
        
        //ACT
        var httpResponse = await new HttpClient().PostAsJsonAsync(Helper.ApiBaseUrl + "/matches", testMatch);


        //ASSERT
        httpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.ExecuteScalar<int>("SELECT match_id as Id, environment as Environment, surface as Surface, date as Date, start_time as StartTime, end_time as EndTime, finished as Finished, notes as Notes FROM tennis_app.match; SELECT player_id as PlayerId1 FROM tennis_app.played_in WHERE player_id = 1 AND match_id=1; SELECT player_id as PlayerId1 FROM tennis_app.played_in WHERE player_id = 2 AND match_id=1;").Should()
                .Be(0); //DB should be empty when create failed
        }
    }
}