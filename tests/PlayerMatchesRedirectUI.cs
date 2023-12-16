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
        await Page.GotoAsync("http://localhost:4200/all-players");

        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = fullname })).ToBeVisibleAsync();
        await Page.GetByRole(AriaRole.Heading, new() { Name = fullname }).ClickAsync();


        //ASSERT
        await Expect(Page.GetByTestId("search-bar").GetByPlaceholder("Search match")).ToBeVisibleAsync();
        await Expect(Page.GetByTestId("search-bar").GetByPlaceholder("Search match")).ToHaveValueAsync(fullname);
    }
}