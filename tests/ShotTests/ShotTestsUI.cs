using Dapper;
using FluentAssertions;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace tests;

public class ShotTestsUI : PageTest
{
    [TestCase("Forced Error", "Backhand Return", "Long", "Down The Line", "Yellow")]
    [TestCase("Unforced Error", "Overhead", "Net", "Cross Court", "Green")]
    [TestCase("Winner", "Forehand Groundstroke", "Not Applicable", "Middle", "Red")]
    public async Task ShotCanSuccessfullyBeRegistered(string shotClassification, string shotType,
        string shotDestination, string shotDirection, string playerPosition)
    {
        //ARRANGE
        Helper.TriggerRebuild();


        //insert a match in database

        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.Query(
                "INSERT INTO tennis_app.match (environment, surface, date, start_time, end_time, finished, notes) VALUES ('hardcodedOutdoor', 'hardcodedClay', '2001-01-01', '2001-01-02 10:10:10', '2001-01-03 11:11:11', false, 'hardcodedNote') RETURNING *;" +
                "insert into tennis_app.players(full_name)VALUES('Mette Jensen');" +
                "insert into tennis_app.players(full_name)VALUES('Emilie Larsen');" +
                " INSERT INTO tennis_app.played_in (player_id, match_id) VALUES (1,1);" +
                "INSERT INTO tennis_app.played_in (player_id, match_id) VALUES (2,1)" +
                "");
        }
        
        var expectedShot = new Shot()
        {
            ShotsId = 1,
            PlayerId = 1,
            MatchId = 1,
            ShotClassification = shotClassification,
            ShotType = shotType,
            ShotDestination = shotDestination,
            ShotDirection = shotDirection,
            PlayerPosition = playerPosition,
        };

        //ACT

        await Page.GotoAsync("http://localhost:4200/match-info/1");

        await Page.GetByRole(AriaRole.Link, new() { Name = "Track shots" }).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "Start Match" }).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = shotClassification }).First.ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "Next" }).ClickAsync();

        await Task.Delay(2000);

        await Page.GetByRole(AriaRole.Button, new() { Name = shotType }).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "Next" }).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = shotDestination }).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = shotDirection, }).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "Next" }).ClickAsync();

        await Page.GetByTestId(playerPosition).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "Next Point" }).ClickAsync();
        

        //ASSERT
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            var shotResult = conn.QueryFirst<Shot>(
                "SELECT shots_id AS ShotsId, player_id AS PlayerId, match_id AS MatchId, shot_classification AS ShotClassification, shot_type AS ShotType, shot_destination AS ShotDestination, shot_direction AS ShotDirection, player_position AS PlayerPosition FROM tennis_app.shots;");

            shotResult.Should()
                .BeEquivalentTo(expectedShot); //Should be equal to shot found in DB
        }
    }

    public async Task MatchCanSuccessfullyEndUI()
    {
        //ARRANGE
        Helper.TriggerRebuild();
        
        //insert a match in database

        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.Query(
                "INSERT INTO tennis_app.match (environment, surface, date, start_time, end_time, finished, notes) VALUES ('hardcodedOutdoor', 'hardcodedClay', '2001-01-01', '2001-01-02 10:10:10', '2001-01-03 11:11:11', false, 'hardcodedNote') RETURNING match_id as Id, environment as Environment, surface as Surface, date as Date, start_time as StartTime, end_time as EndTime, finished as Finished, notes as Notes;" +
                "insert into tennis_app.players(full_name)VALUES('Mette Jensen');" +
                "insert into tennis_app.players(full_name)VALUES('Emilie Larsen');" +
                " INSERT INTO tennis_app.played_in (player_id, match_id) VALUES (1,1);" +
                "INSERT INTO tennis_app.played_in (player_id, match_id) VALUES (2,1)" +
                "");
        }
       
        
    }
}