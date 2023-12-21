using Dapper;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace tests;

public class PlayerMatchesRedirectUI : PageTest
{
    [TestCase("James Blue")]
    public async Task CanGotoHomeAndSearchFullnameFromUi(string fullname)

    {
        //ARRANGE
        Helper.TriggerRebuild();

        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            //insert a player to click on
            conn.QueryFirst<Player>(
                "INSERT INTO tennis_app.players (full_name) VALUES (@fullname) RETURNING player_id AS PlayerId, full_name AS FullName, active;",
                new { fullname });
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
        
        
        await Page.GotoAsync("http://localhost:4200/tabs/all-players");

        await Page.GetByRole(AriaRole.Heading, new() { Name = fullname }).ClickAsync();


        //ASSERT
        await Expect(Page.GetByRole(AriaRole.Searchbox, new() { Name = "search text" }).First).ToBeVisibleAsync();
        await Expect(Page.GetByRole(AriaRole.Searchbox, new() { Name = "search text" }).First).ToHaveValueAsync(fullname);

    }
}