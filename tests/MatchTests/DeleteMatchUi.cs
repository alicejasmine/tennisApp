using Dapper;
using FluentAssertions;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace tests;

public class DeleteMatchUi : PageTest
{
    [Test]
    public async Task MatchCanBeSuccessfullyDeletedFromUi() {

        
        //ARRANGE
        Helper.TriggerRebuild();
        
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.Query(
                "INSERT INTO tennis_app.match (environment, surface, date, start_time, end_time, finished, notes) VALUES ('outdoor', 'clay', '2001-01-01', '2001-01-02 10:10:10', '2001-01-03 11:11:11', true, 'hardcodedNote') RETURNING *;" +
                "insert into tennis_app.players(full_name)VALUES('Aleksandra Kurdelska');" +
                "insert into tennis_app.players(full_name)VALUES('Bob Pancakes');" +
                "INSERT INTO tennis_app.played_in (player_id, match_id) VALUES (1,1);" +
                "INSERT INTO tennis_app.played_in (player_id, match_id) VALUES (2,1);");
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

        await Page.GetByRole(AriaRole.Heading, new() { Name = "01-01-2001 || Bob Pancakes VS Aleksandra Kurdelska" }).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "Delete match" }).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "Confirm" }).ClickAsync();
        
        await Page.GotoAsync("http://localhost:4200/tabs/home");

      
        //ASSERT
        await Expect(Page.Locator("ion-grid").Nth(1)).ToBeEmptyAsync();
 
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.ExecuteScalar<int>("SELECT COUNT(*) FROM tennis_app.match;").Should().Be(0);
            conn.ExecuteScalar<int>("SELECT COUNT(*) FROM tennis_app.played_in").Should().Be(0);
        }
    }
}