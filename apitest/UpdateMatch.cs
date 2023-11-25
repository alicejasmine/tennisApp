using System.Net.Http.Json;
using Dapper;
using FluentAssertions;
using Newtonsoft.Json;
using NUnit.Framework;

namespace tests;

[TestFixture]
public class UpdateMatch
{
    /*[TestCase("TestCaseIndoor", "clay", "2000-01-01", "2023-11-24T09:30:22.965Z", "2023-11-24T09:30:22.965Z", true, "some note")]
    public async Task MatchCanSuccessfullyBeUpdatedFromHttpRequest(string environment, string surface, DateTime date, DateTime startTime, DateTime endTime, bool finished, string notes)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            //Insert an match to be updated
            conn.QueryFirst<Match>(
                "INSERT INTO tennis_app.match (environment, surface, date, start_time, end_time, finished, notes) VALUES ('hardcodedOutdoor', 'hardcodedClay', '2001-01-01', '2001-01-02 10:10:10', '2001-01-03 11:11:11', true, 'hardcodedNote') RETURNING *;");
        }

        var testMatch = new Match()
        {
            Id = 1, Environment = environment, Surface = surface, Date = date, StartTime = startTime, EndTime = endTime,
            Finished = finished, Notes = notes
        };

        //ACT
        var httpResponse = await new HttpClient().PutAsJsonAsync(Helper.ApiBaseUrl + "/matches/1", testMatch);
        var matchFromResponseBody =
            JsonConvert.DeserializeObject<Match>(await httpResponse.Content.ReadAsStringAsync());

        //ASSERT
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.QueryFirst<Match>("SELECT * FROM tennis_app.match;").Should().BeEquivalentTo(matchFromResponseBody);
        }
    }*/
}