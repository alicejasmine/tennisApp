using System.Text.RegularExpressions;
using Dapper;
using FluentAssertions;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace tests;

/*public class CreateMatchUi : PageTest
{
    //await Page.Locator("calendar-day calendar-day-active calendar-day-today").ClickAsync();

    [TestCase("indoor", "clay", "2023-12-16", "2023-11-23 19:14:12.965", false, "some note", 1, 2)]
    public async Task MatchCanBeSuccessfullyCreatedFromUI(string environment, string surface, DateTime date,
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

        string hour = DateTime.Now.Hour.ToString();
        string minutes = DateTime.Now.Minute.ToString();

        //ACT
        await Page.GotoAsync("http://localhost:4200/");

        await Page.GotoAsync("http://localhost:4200/home");

        await Page.GetByRole(AriaRole.Button, new() { Name = "Create Match" }).ClickAsync();

        await Page.GetByLabel("Today, Saturday, December 16").ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = hour }).Nth(1).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = minutes }).ClickAsync();

        await Page.GetByText("Player 1Player").ClickAsync();

        await Page.GetByRole(AriaRole.Radio, new() { Name = "Aleksandra Kurdelska" }).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "OK" }).ClickAsync();

        await Page.WaitForTimeoutAsync(2000);

        await Page.GetByText("Player 2Player").ClickAsync();

        await Page.GetByRole(AriaRole.Radio, new() { Name = "Bob Pancakes" }).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "OK" }).ClickAsync();

        await Page.GetByText("Pick environment").ClickAsync();

        await Page.GetByRole(AriaRole.Radio, new() { Name = environment }).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "OK" }).ClickAsync();

        await Page.GetByText("Pick surface").ClickAsync();

        await Page.GetByRole(AriaRole.Radio, new() { Name = surface }).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "OK" }).ClickAsync();

        await Page.GetByLabel("Notes").ClickAsync();

        await Page.GetByLabel("Notes").FillAsync(notes);

        await Page.GetByRole(AriaRole.Button, new() { Name = "Create match" }).ClickAsync();

        //ASSERT
        await Expect(Page.GetByRole(AriaRole.Heading,
            new() { Name = "16-12-2023 || Aleksandra Kurdelska VS Bob Pancakes" })).ToBeVisibleAsync();

        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            DateTime now = DateTime.Now.Date.AddHours(DateTime.Now.Hour).AddMinutes(DateTime.Now.Minute);

            var expected = new Match()
            {
                Id = 1,
                Environment = environment,
                Surface = surface,
                Date = date,
                StartTime = now,
                Finished = finished,
                Notes = notes,
                PlayerId1 = playerId1,
                PlayerId2 = playerId2,
                FullNamePlayer1 = "Aleksandra Kurdelska",
                FullNamePlayer2 = "Bob Pancakes"
            };

            var insertedMatch = conn.QueryFirst<Match>(
                "SELECT m.match_id as Id, m.environment as Environment, m.surface as Surface, m.date as Date, m.start_time as StartTime, m.finished as Finished, m.notes as Notes, pi1.player_id as PlayerId1, pi2.player_id as PlayerId2, p1.full_name as FullNamePlayer1, p2.full_name as FullNamePlayer2 " +
                " FROM tennis_app.match m " +
                "INNER JOIN tennis_app.played_in pi1 ON m.match_id = pi1.match_id AND pi1.player_id = 1 " +
                "INNER JOIN tennis_app.played_in pi2 ON m.match_id = pi2.match_id AND pi2.player_id = 2 " +
                "INNER JOIN tennis_app.players p1 ON pi1.player_id = p1.player_id " +
                "INNER JOIN tennis_app.players p2 ON pi2.player_id = p2.player_id;");

            insertedMatch.Should()
                .BeEquivalentTo(expected);
        }
    }
}*/