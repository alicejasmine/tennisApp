using Dapper;
using FluentAssertions;
using FluentAssertions.Execution;
using Newtonsoft.Json;
using NUnit.Framework;
using tests;

namespace apitests.SearchTests;

public class SearchPlayer
{
    [Test]
    [TestCase("Name")]
    [TestCase("name")]
    [TestCase("NAME")]
    [TestCase("NAme")]
    [TestCase("Nam")]
    public async Task SuccessfullPlayerSearch(string searchterm)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        int expectedResult = 5;

        for (var i = 1; i <= 5; i++)
        {
            var player = new Player()
            {
                PlayerId = i,
                FullName = $"Name{i}"
            };

            await using (var conn = await Helper.DataSource.OpenConnectionAsync())
            {
                conn.QueryFirst<Player>(
                    "INSERT INTO tennis_app.players(full_name) VALUES(@fullname) RETURNING *",
                    new { fullname = player.FullName });
            }
        }

        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.QueryFirst<Player>(
                "INSERT INTO tennis_app.players(full_name) VALUES(@fullname) RETURNING *",
                new { fullname = "NotAResult" });
        }

        //ACT
        var httpResponse =
            await new HttpClient().GetAsync(Helper.ApiBaseUrl + $"/players/search?searchTerm={searchterm}");

        //ASSERT
        httpResponse.EnsureSuccessStatusCode();

        var playersFromResponseBody =
            JsonConvert.DeserializeObject<IEnumerable<SearchPlayerItem>>(
                await httpResponse.Content.ReadAsStringAsync());

        using (new AssertionScope())
        {
            httpResponse.IsSuccessStatusCode.Should().BeTrue();
            playersFromResponseBody.Count().Should().Be(expectedResult);
            playersFromResponseBody.Select(p => p.FullName).Should()
                .Contain(name => name.ToLower().Contains(searchterm.ToLower()));
            playersFromResponseBody.Select(p => p.FullName).Should()
                .NotContain(name => name.Contains("NotAResult"));
        }
    }


    [Test]
    [TestCase("NonExistentResult")]
    public async Task FullNameSearchNoResults(string searchterm)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        HttpResponseMessage httpResponse;

        //ACT
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            httpResponse = await new HttpClient().GetAsync(
                Helper.ApiBaseUrl + $"/players/search?searchTerm={searchterm}");

            var playersFromResponseBody =
                JsonConvert.DeserializeObject<IEnumerable<SearchPlayerItem>>(
                    await httpResponse.Content.ReadAsStringAsync());
            //ASSERT
            using (new AssertionScope())
            {
                httpResponse.IsSuccessStatusCode.Should().BeTrue();
                playersFromResponseBody.Should().BeEmpty();
            }
        }
    }
}