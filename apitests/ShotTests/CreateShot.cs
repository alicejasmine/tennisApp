using System.Net;
using System.Net.Http.Json;
using apitests.Models;
using Dapper;
using FluentAssertions;
using Newtonsoft.Json;
using NUnit.Framework;

namespace apitests.ShotTests;


public class CreateShot
{
    
    [TestCase( "Winner", "Forehand Groundstroke", "Net", "Middle", "Green")]
    [TestCase( "Unforced Error", "Backhand Groundstroke", "Not Applicable", "Middle", "Green")]
    [TestCase( "Forced Error", "Backhand Volley", "Net", "Down The Line", "Red")]
    [TestCase( "Winner", "Backhand Return", "Wide", "Cross Court", "Yellow")]
    [TestCase( "Unforced Error", "Overhead", "Long", "Down The Line", "Red")]
    public async Task ShotCanBeSuccessfullyCreatedFromHttp(
        string shotClassification, string shotType, string shotDestination,
        string shotDirection, string playerPosition)
    {
        //ARRANGE
        Helper.TriggerRebuild();

        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.Query(
                "insert into tennis_app.players(full_name, active)VALUES('Jeff Lebowski', true);" +
                "insert into tennis_app.players(full_name, active)VALUES('John Malkovich', true);" +
                "insert into tennis_app.match(environment, surface, date, start_time, end_time, notes) VALUES ('indoor', 'clay', '2023-11-23', '2023-11-23 19:14:12.965', '2023-11-23 19:14:12.965', 'notes');");
        }
        

        var testShot = new Shot()
        {
            PlayerId = 1,
            MatchId = 1,
            ShotClassification = shotClassification, 
            ShotType = shotType,
            ShotDestination = shotDestination, 
            ShotDirection = shotDirection, 
            PlayerPosition = playerPosition
        };
        
        
        //ACT
        
        
        var httpResponse =
            await new HttpClient().PostAsJsonAsync(Helper.ApiBaseUrl + "/shots/1/1/shots", testShot);

        var shotFromResponseBody =
            JsonConvert.DeserializeObject<Shot>(await httpResponse.Content.ReadAsStringAsync()); 
        
        
        
        //ASSERT
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            var shotResult = conn.QueryFirst<Shot>(
                "SELECT shots_id AS ShotsId, player_id AS PlayerId, match_id AS MatchId, shot_classification AS ShotClassification, shot_type AS ShotType, shot_destination AS ShotDestination, shot_direction AS ShotDirection, player_position AS PlayerPosition FROM tennis_app.shots;");
            
            shotResult.Should()
                .BeEquivalentTo(shotFromResponseBody); //Should be equal to shot found in DB
        }
    }
    
    [TestCase("Forced Error", "Serv Deuce", "Not Applicable", "Cross Court", "Yellow")]
    [TestCase("Winner", "Serve Add", "Nat", "Middle", "Green")]
    [TestCase("Unforced Error", "Other", "idk", "Middle", "Green")]
    [TestCase("", "", "", "", " ")]
    public async Task ServerSideDataValidationShouldReject(
        string shotClassification, string shotType, string shotDestination,
        string shotDirection, string playerPosition)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.Query(
                "insert into tennis_app.players(full_name, active)VALUES('Jeff Lebowski', true);" +
                "insert into tennis_app.players(full_name, active)VALUES('John Malkovich', true);" +
                "insert into tennis_app.match(environment, surface, date, start_time, end_time, notes) VALUES ('indoor', 'clay', '2023-11-23', '2023-11-23 19:14:12.965', '2023-11-23 19:14:12.965', 'notes');");
        }
        
        var testShot = new Shot()
        {
            PlayerId = 1,
            MatchId = 1,
            ShotClassification = shotClassification,
            ShotType = shotType,
            ShotDestination = shotDestination,
            ShotDirection = shotDirection,
            PlayerPosition = playerPosition
        };


        //ACT
        var httpResponse =
            await new HttpClient().PostAsJsonAsync(Helper.ApiBaseUrl + "/shots/1/1/shots", testShot);
        
        //ASSERT
        httpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.ExecuteScalar<int>("SELECT COUNT(*) FROM tennis_app.shots;").Should()
                .Be(0); //Should be empty when create fails
        }

    }
}