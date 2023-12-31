using Dapper;
using FluentAssertions;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace tests;

public class CreatePlayerUI : PageTest
{
    [TestCase("James Blue")]
    public async Task PlayerCanSuccessfullyBeCreatedFromUi(string fullname)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        
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
        
        //ACT
        await Page.GotoAsync("http://localhost:4200/tabs/all-players");

        await Page.GetByRole(AriaRole.Button, new() { Name = "Create Player" }).ClickAsync();

        await Page.GetByLabel("Fullname").ClickAsync();

        await Page.GetByLabel("Fullname").FillAsync(fullname);

        await Page.GetByRole(AriaRole.Button, new() { Name = "Create" }).ClickAsync();


        //ASSERT
        //Created player should be visible 
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = fullname })).ToBeVisibleAsync();

        //player in db is the one created
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            var insertedPlayer =
                conn.QueryFirst<Player>(
                    "SELECT player_id AS PlayerId, full_name AS FullName, active FROM tennis_app.players;");

            var expected = new Player()
            {
                PlayerId = 1,
                FullName = fullname,
                Active = true
            };
            insertedPlayer.Should()
                .BeEquivalentTo(expected);
        }
    }
}