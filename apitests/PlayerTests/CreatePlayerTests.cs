using System.Net;
using System.Net.Http.Json;
using Dapper;
using FluentAssertions;
using Newtonsoft.Json;
using NUnit.Framework;
using tests;


namespace apitests.PlayerTests;

public class CreatePlayerTests
{
    [TestCase("Name")]
    public async Task PlayerCanSuccessfullyBeCreatedFromHttpRequest(string fullname)
    {
        //ARRANGE
        Helper.TriggerRebuild();

        var testPlayer = new Player
        {
            PlayerId = 1, FullName = fullname
        };

        //ACT
        var httpResponse = await new HttpClient().PostAsJsonAsync(Helper.ApiBaseUrl + "/players", testPlayer);
        Player playerFromResponseBody =
            JsonConvert.DeserializeObject<Player>(await httpResponse.Content.ReadAsStringAsync());


        //ASSERT
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            var resultPlayer = conn.QueryFirst<Player>(
                "SELECT player_id AS PlayerId, full_name AS FullName, active FROM tennis_app.players;");
            resultPlayer.Should()
                .BeEquivalentTo(playerFromResponseBody);
        }
    }


    [TestCase("Full name that is long and exceeds the set character limit")]
    public async Task ServerSideDataValidationShouldRejectPlayerWithLongFullName(string fullname)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        var testPlayer = new Player()
        {
            PlayerId = 1, FullName = fullname
        };

        //ACT
        var httpResponse = await new HttpClient().PostAsJsonAsync(Helper.ApiBaseUrl + "/players", testPlayer);


        //ASSERT
        httpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.ExecuteScalar<int>("SELECT COUNT(*) FROM tennis_app.players;").Should()
                .Be(0); //Database should be empty when create player failed
        }
    }

    [TestCase("AlreadyExistingName")]
    public async Task ApiShouldRejectPlayerWhenFullnameAlreadyExists(string fullname)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        var testPlayer = new Player()
        {
            PlayerId = 1, FullName = fullname
        };
        using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.Execute(
                "INSERT INTO tennis_app.players (full_name) VALUES (@fullname) RETURNING *;",
                new { fullname });
        }

        //ACT
        var httpResponse = await new HttpClient().PostAsJsonAsync(Helper.ApiBaseUrl + "/players", testPlayer);


        //ASSERT
        httpResponse.Should().HaveError();
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.ExecuteScalar<int>("SELECT COUNT(*) FROM tennis_app.players;").Should()
                .Be(1); //DB should have just the pre-existing player, and not also the new one
        }
    }
}