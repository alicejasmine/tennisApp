using Dapper;
using FluentAssertions;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace tests;

public class EditPlayerUI : PageTest
{
    [TestCase("James Blue")]
    public async Task PlayerCanSuccessfullyBeUpdatedFromUi(string fullname)
    {
        //ARRANGE
        Helper.TriggerRebuild();


        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            //insert a player to update it in db
            conn.QueryFirst<Player>(
                "INSERT INTO tennis_app.players (full_name) VALUES (@fullname) RETURNING *;",
                new { fullname });
        }

        //fields to update player
        var updatedName = "James Black";
        var updatedActive = "not active"; //sets active as false

        //ACT
        //update from UI
     
        await Page.GotoAsync("http://localhost:4200/all-players");

        await Page.GetByRole(AriaRole.Button, new() { Name = "Update" }).ClickAsync();

        await Page.GetByLabel("Fullname:").ClickAsync();

        await Page.GetByLabel("Fullname:").FillAsync(updatedName);

        await Page.Locator("#select-label").GetByText("active").ClickAsync();

        await Page.GetByRole(AriaRole.Radio, new() { Name = "not active" }).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "OK" }).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "Update" }).ClickAsync();

        
        //ASSERT
        //updated player is in database
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.QueryFirst<Player>(
                    "SELECT player_id AS PlayerId, full_name AS FullName, active FROM tennis_app.players;").Should()
                .BeEquivalentTo(new Player()
                    { PlayerId = 1, FullName = updatedName, Active = false });
        }


        //updated player is present on the page
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = updatedName })).ToBeVisibleAsync();
    }
}