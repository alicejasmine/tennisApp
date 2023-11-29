using System.Net;
using System.Net.Http.Json;
using Dapper;
using FluentAssertions;
using Newtonsoft.Json;
using NUnit.Framework;
using tests;

namespace apitests.PlayerTests;

public class UpdatePlayerTests
{
    [Test]
    public async Task PlayerCanSuccessfullyBeUpdatedFromHttpRequest()
    {
        //ARRANGE
        Helper.TriggerRebuild();


        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.QueryFirst<Player>(
                "INSERT INTO tennis_app.players(full_name) VALUES('oldName') RETURNING *");
        }

        var testPlayer = new Player()
        {
            PlayerId = 1, FullName = "newName", Active = false
        };


        //ACT
        var httpResponse = await new HttpClient().PutAsJsonAsync(Helper.ApiBaseUrl + "/players/1", testPlayer);

        httpResponse.EnsureSuccessStatusCode();

        var playerFromResponseBody =
            JsonConvert.DeserializeObject<Player>(await httpResponse.Content.ReadAsStringAsync());


        //ASSERT
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            var resultPlayer =
                conn.QueryFirst<Player>(
                    "SELECT player_id AS PlayerId, full_name AS FullName, active FROM tennis_app.players;");
            resultPlayer.Should().BeEquivalentTo(playerFromResponseBody);
        }
    }


    [TestCase("Full name that is long and exceeds the set character limit", true)]
    public async Task ServerSideDataValidationShouldRejectPlayerWithLongFullName(string fullname, bool active)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            //Insert a player in DB to be updated
            conn.QueryFirst<Player>(
                "INSERT INTO tennis_app.players (full_name,active) VALUES ('oldName',true) RETURNING *;");
        }

        var testPlayer = new Player()
        {
            PlayerId = 1, FullName = fullname, Active = active
        };

        //ACT
        var httpResponse = await new HttpClient().PutAsJsonAsync(Helper.ApiBaseUrl + "/players/1", testPlayer);


        //ASSERT
        httpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
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
        var httpResponse = await new HttpClient().PostAsJsonAsync(Helper.ApiBaseUrl + "/players/1", testPlayer);


        //ASSERT
        httpResponse.Should().HaveError();
    }
}