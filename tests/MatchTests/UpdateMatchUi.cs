using Dapper;
using FluentAssertions;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace tests;

public class UpdateMatchUi : PageTest
{
    [TestCase("indoor", "hard", "2001-01-12", "2001-01-12 00:30:00.000", "2023-11-24T09:30:22.965Z", false,
        "some note", 1, 2)]
    public async Task MatchCanSuccessfullyBeUpdatedFromUi(string environment, string surface, DateTime date,
        DateTime startTime, DateTime endTime, bool finished, string notes, int playerId1, int playerId2)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            //Insert an match to be updated
            conn.Query(
                "INSERT INTO tennis_app.match (environment, surface, date, start_time, end_time, finished, notes) VALUES ('outdoor', 'clay', '2001-01-01', '2001-01-02 10:10:10', '2001-01-03 11:11:11', false, 'some note') RETURNING *;" +
                "insert into tennis_app.players(full_name)VALUES('Aleksandra Kurdelska');" +
                "insert into tennis_app.players(full_name)VALUES('Bob Pancakes');" +
                " INSERT INTO tennis_app.played_in (player_id, match_id) VALUES (1,1);" +
                "INSERT INTO tennis_app.played_in (player_id, match_id) VALUES (2,1)");
        }
        

        //ACT
        // Navigate to the page without setting the token initially
        await Page.GotoAsync("http://localhost:4200");

        
        // Set the token using injected script
        await Page.EvaluateAsync(
            "() => {" +
            "   sessionStorage.setItem('token', 'TotallyARealToken');" +
            "   sessionStorage.setItem('role', 'Admin');" +
            "}"
        );

        // Refresh the page to apply the changes
        await Page.ReloadAsync();

        await Page.GotoAsync("http://localhost:4200/tabs/home");

        await Page.GetByRole(AriaRole.Button, new() { Name = "Edit" }).ClickAsync();

        await Page.GetByLabel("Friday, January 12").ClickAsync();
        
        await Page.GetByRole(AriaRole.Button, new() { Name = "24", Exact = true }).Nth(1).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "30", Exact = true }).ClickAsync();

        await Page.GetByText("Environmentoutdoor").ClickAsync();

        await Page.GetByRole(AriaRole.Radio, new() { Name = environment }).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "OK" }).ClickAsync();

        await Page.GetByText("Surfaceclay").ClickAsync();

        await Page.GetByRole(AriaRole.Radio, new() { Name = surface }).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "OK" }).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "Update match" }).ClickAsync();
        
        await Page.WaitForTimeoutAsync(2000);


        //ASSERT
        await Expect(Page.GetByRole(AriaRole.Heading,
            new() { Name = "12-01-2001 || Bob Pancakes VS Aleksandra Kurdelska" })).ToBeVisibleAsync();

        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {

            var expected = new MatchWithPlayers()
            {
                Id = 1,
                Environment = environment,
                Surface = surface,
                Date = date,
                StartTime = startTime,
                Finished = finished,
                Notes = notes,
                PlayerId1 = playerId1,
                PlayerId2 = playerId2,
                FullNamePlayer1 = "Aleksandra Kurdelska",
                FullNamePlayer2 = "Bob Pancakes"
            };

            var updatedMatch = conn.QueryFirst<MatchWithPlayers>(
                "SELECT m.match_id as Id, m.environment as Environment, m.surface as Surface, m.date as Date, m.start_time as StartTime, m.end_time as EndTime, m.finished as Finished, m.notes as Notes, pi1.player_id as PlayerId1, pi2.player_id as PlayerId2, p1.full_name as FullNamePlayer1, p2.full_name as FullNamePlayer2 " +
                " FROM tennis_app.match m " +
                "INNER JOIN tennis_app.played_in pi1 ON m.match_id = pi1.match_id AND pi1.player_id = 1 " +
                "INNER JOIN tennis_app.played_in pi2 ON m.match_id = pi2.match_id AND pi2.player_id = 2 " +
                "INNER JOIN tennis_app.players p1 ON pi1.player_id = p1.player_id " +
                "INNER JOIN tennis_app.players p2 ON pi2.player_id = p2.player_id;");

            updatedMatch.Should().BeEquivalentTo(expected);
        }
    }
}