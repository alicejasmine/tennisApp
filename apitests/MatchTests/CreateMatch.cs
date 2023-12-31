﻿using System.Net;
using System.Net.Http.Json;
using apitests.Models;
using Dapper;
using FluentAssertions;
using Newtonsoft.Json;
using NUnit.Framework;

namespace apitests.MatchTests;

[TestFixture]
public class CreateMatch
{
    [TestCase("indoor", "clay", "2023-11-23", "2023-11-23 19:14:12.965", "2023-11-23 19:14:12.965", true, "some note",
        1, 2)]
    [TestCase("outdoor", "hard", "2023-11-23", "2023-11-23 19:14:12.965", "2023-11-23 19:14:12.965", true, "some note",
        1, 2)]
    public async Task MatchCanSuccessfullyBeCreatedFromHttpRequest(string environment, string surface, DateTime date,
        DateTime startTime,
        DateTime endTime, bool finished, string notes, int playerId1, int playerId2)
    {
        //ARRANGE
        Helper.TriggerRebuild();

        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.Query(
                "insert into tennis_app.players(full_name)VALUES('Aleksandra Kurdelska');" +
                "insert into tennis_app.players(full_name)VALUES('Bob Pancakes');");
        }

        var testMatch = new MatchWithPlayers()
        {
            Id = 1, Environment = environment, Surface = surface, Date = date, StartTime = startTime, EndTime = endTime,
            Finished = finished, Notes = notes, PlayerId1 = playerId1, PlayerId2 = playerId2
        };

        //ACT
        var httpResponse = await new HttpClient().PostAsJsonAsync(Helper.ApiBaseUrl + "/matches", testMatch);
        var matchFromResponseBody =
            JsonConvert.DeserializeObject<MatchWithPlayers>(await httpResponse.Content.ReadAsStringAsync());


        //ASSERT
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            var resultMatchAndPlayers = conn.QueryFirst<MatchWithPlayers>(
                "SELECT m.match_id as Id, m.environment as Environment, m.surface as Surface, m.date as Date, m.start_time as StartTime, m.end_time as EndTime, m.finished as Finished, m.notes as Notes, pi1.player_id as PlayerId1, pi2.player_id as PlayerId2, p1.full_name as FullNamePlayer1, p2.full_name as FullNamePlayer2 " +
                " FROM tennis_app.match m " +
                "INNER JOIN tennis_app.played_in pi1 ON m.match_id = pi1.match_id AND pi1.player_id = 1 " +
                "INNER JOIN tennis_app.played_in pi2 ON m.match_id = pi2.match_id AND pi2.player_id = 2 " +
                "INNER JOIN tennis_app.players p1 ON pi1.player_id = p1.player_id " +
                "INNER JOIN tennis_app.players p2 ON pi2.player_id = p2.player_id;");
            resultMatchAndPlayers.Should().BeEquivalentTo(matchFromResponseBody); //Should be equal to match found in DB
        }


    }



    //Here we're testing that the API returns a bad request response and no match is created when bad values are sent
    [TestCase("indoorrrrrr", "clay", "2000-01-01", "2023-11-24T09:30:22.965Z", "2023-11-24T09:30:22.965Z", true,
        "some note", 1, 2)]
    public async Task ServerSideDataValidationShouldRejectBadValues(string environment, string surface, DateTime date,
        DateTime startTime, DateTime endTime, bool finished, string notes, int playerId1, int playerId2)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.Query(
                "insert into tennis_app.players(full_name)VALUES('Aleksandra Kurdelska');" +
                "insert into tennis_app.players(full_name)VALUES('Bob Pancakes');");
        }

        var testMatch = new MatchWithPlayers()
        {
            Id = 1, Environment = environment, Surface = surface, Date = date, StartTime = startTime, EndTime = endTime,
            Finished = finished, Notes = notes, PlayerId1 = playerId1, PlayerId2 = playerId2
        };
        
        
        //ACT
        var httpResponse = await new HttpClient().PostAsJsonAsync(Helper.ApiBaseUrl + "/matches", testMatch);


        //ASSERT
        httpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.ExecuteScalar<int>("SELECT match_id as Id, environment as Environment, surface as Surface, date as Date, start_time as StartTime, end_time as EndTime, finished as Finished, notes as Notes FROM tennis_app.match; SELECT player_id as PlayerId1 FROM tennis_app.played_in WHERE player_id = 1 AND match_id=1; SELECT player_id as PlayerId1 FROM tennis_app.played_in WHERE player_id = 2 AND match_id=1;").Should()
                .Be(0); //DB should be empty when create failed
        }
    }
}