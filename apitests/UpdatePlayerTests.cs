using System.Net;
using System.Net.Http.Json;
using Dapper;
using FluentAssertions;
using Newtonsoft.Json;
using NUnit.Framework;
using test;

namespace tests;

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

        var expectedPlayer = new Player()
        {
            PlayerId = 1, FullName = "newName", Active = false
        };


        //ACT
        var httpResponse = await new HttpClient().PutAsJsonAsync(Helper.ApiBaseUrl + "/players/1", expectedPlayer);
        
        httpResponse.EnsureSuccessStatusCode();

        var playerFromResponseBody =
            JsonConvert.DeserializeObject<Player>(await httpResponse.Content.ReadAsStringAsync());


        //ASSERT
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            var resultPlayer =  conn.QueryFirst<Player>("SELECT player_id AS PlayerId, full_name AS FullName, active FROM tennis_app.players;");
            resultPlayer.Should().BeEquivalentTo(playerFromResponseBody);
        }
        
    }


 

}