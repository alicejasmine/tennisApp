using Bogus.DataSets;
using Dapper;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace tests;

public class SearchPlayerUI : PageTest
{
    [TestCase("Alexander Smith")]
    [TestCase("Sophie Green")]
    [TestCase("James Blue")]
    public async Task CanSearchUI(string fullname)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        var player = new Player()
        {
            FullName = fullname,
            Active = true
        };
//insert player in db
        var sql = $@"
            insert into tennis_app.players ( full_name, active) VALUES(@fullname, @active)";
        using (var conn = Helper.DataSource.OpenConnection())
        {
            conn.Execute(sql, player);
        }

        //ACT

        await Page.GotoAsync("http://localhost:4200/all-players");

        await Page.GetByLabel("search text").ClickAsync();
        await Page.GetByRole(AriaRole.Searchbox, new() { Name = "search text" }).FillAsync(fullname);


        //ASSERT
        //searchbar is filled with fullname and the searched player is visible
        await Expect(Page.GetByLabel("search text")).ToHaveValueAsync(fullname);
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = fullname })).ToBeVisibleAsync();
    }


    [Test]
    [TestCase("Alexander Smith")]
    public async Task CanSearchUIFail(string fullname)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        var player = new Player()
        {
            PlayerId = 1,
            FullName = fullname,
            Active = true
        };

        var sql = $@"
            insert into tennis_app.players ( full_name, active) VALUES(@fullname, @active)";
        using (var conn = Helper.DataSource.OpenConnection())
        {
            conn.Execute(sql, player);
        }


        //ACT
        await Page.GotoAsync("http://localhost:4200/all-players");

        await Page.GetByLabel("search text").ClickAsync();

        const string nonExistentPlayerName = "John Doe";
        await Page.GetByLabel("search text").FillAsync(nonExistentPlayerName);

        //ASSERT

        await Expect(Page.Locator("ion-card")).Not.ToBeVisibleAsync(); //no cards visible when search has no results
    }
}