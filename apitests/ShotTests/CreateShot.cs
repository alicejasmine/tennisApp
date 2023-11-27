using System.Net;
using System.Net.Http.Json;
using Dapper;
using FluentAssertions;
using Newtonsoft.Json;
using NUnit.Framework;

namespace apitests.ShotTests;

[TestFixture]
public class CreateShot
{
    
    [TestCase( "Winner", "Forehand Groundstroke", "Net", "Middle", "Green")]
    [TestCase( "Unforced Error", "Backhand Groundstroke", "Not Applicable", "Middle", "Green")]
    [TestCase( "Forced Error", "Backhand Volley", "Net", "Down The Line", "Red")]
    [TestCase( "Winner", "Backhand Return", "Wide", "Cross Court", "Yellow")]
    [TestCase( "Unforced Error", "Overhead", "Long", "Down The Line", "Red")]
    [TestCase( "Forced Error", "Serve Deuce", "Not Applicable", "Cross Court", "Yellow")]
    [TestCase( "Winner", "Serve Add", "Net", "Middle", "Green")]
    [TestCase( "Unforced Error", "Other", "Net", "Middle", "Green")]
    [TestCase( "Winner", "Forehand Volley", "Wide", "Down The Line", "Red")]
    [TestCase( "Unforced Error", "Forehand Return", "Long", "Cross Court", "Yellow")]
    public async Task ShotCanBeSuccessfullyCreatedFromHttp(
        string shotClassification, string shotType, string shotDestination,
        string shotDirection, string playerPosition)
    {
        //ARRANGE
        Helper.TriggerRebuild();
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
            await new HttpClient().PostAsJsonAsync("http://localhost:5000/api/shots/"+1+"/"+1+"/shots", testShot);

        var shotFromResponseBody =
            JsonConvert.DeserializeObject<Shot>(await httpResponse.Content.ReadAsStringAsync()); 
        
        
        
        //ASSERT
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            
            
            conn.QueryFirstOrDefault<Shot>("SELECT * FROM tennis_app.shots;").Should()
                .BeEquivalentTo(shotFromResponseBody); //Should be equal to shot found in DB
        }
    }
    [TestCase("Unforced Error", "Forehand Return", "Long", "This player sucks", "Yellow")]
    [TestCase("winner", "Forehand Groundstroke", "Net", "Middle", "Green")]
    [TestCase("UnforcedError", "Backhand Groundstroke", "Not Applicable", "Middle", "Green")]
    [TestCase("Forced Error", "Backhand Volley", "Net", "Down The Line", "My favorite color is clear")]
    [TestCase("Winner", "BackhandReturn", "Wide", "Cross Court", "Yellow")]
    [TestCase("Unforced Error", "OverHead", "Long", "Down The Line", "Red")]
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
            await new HttpClient().PostAsJsonAsync("http://localhost:5000/api/shots/" + 1 + "/" + 1 + "/shots",
                testShot);
        
        //ASSERT
        httpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.ExecuteScalar<int>("SELECT COUNT(*) FROM tennis_app.shots;").Should()
                .Be(0); //Should be empty when create fails
        }

    }
}