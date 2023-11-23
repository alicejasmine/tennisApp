using System.Net.Http.Json;
using Dapper;
using FluentAssertions;
using Newtonsoft.Json;
using NUnit.Framework;

namespace tests;

[TestFixture]
public class CreateMatch
{
   [TestCase("indoor", "clay", "2023-11-23", "2023-11-23T19:14:12.542Z", "2023-11-23T19:14:12.542Z", true, "some note")]
    public async Task MatchCanSuccessfullyBeCreatedFromHttpRequest(string environment, string surface, DateTime date, DateTime startTime,
        DateTime endTime, bool finished, string notes)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        var testMatch = new Match()
        {
            Id = 1, Environment = environment, Surface = surface, Date = date, StartTime = startTime, EndTime = endTime, Finished = finished, Notes = notes
        };

        //ACT
        var httpResponse = await new HttpClient().PostAsJsonAsync(Helper.ApiBaseUrl + "/matches", testMatch);
        var matchFromResponseBody =
            JsonConvert.DeserializeObject<Match>(await httpResponse.Content.ReadAsStringAsync());


        //ASSERT
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.QueryFirst<Match>("SELECT * FROM tennis_app_test.match;").Should()
                .BeEquivalentTo(matchFromResponseBody); //Should be equal to match found in DB
        }
    }


  
    /*//Here we're testing that the API returns a bad request response and no article is created when bad values are sent
    [TestCase("aslkdjlksadj", "NotAValidAuthorNameHere", "sadjsalkdj", "salkdjlsakdjskladjlk")]
    [TestCase("", "NotAValidAuthorNameHere", "sadjsalkdj", "salkdjlsakdjskladjlk")]
    public async Task ServerSideDataValidationShouldRejectBadValues(string headline, string author, string imgurl,
        string body)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        var testArticle = new Article()
        {
            ArticleId = 1, ArticleImgUrl = imgurl, Author = author, Body = body, Headline = headline
        };

        //ACT
        var httpResponse = await new HttpClient().PostAsJsonAsync(Helper.ApiBaseUrl + "/articles", testArticle);


        //ASSERT
        httpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.ExecuteScalar<int>("SELECT COUNT(*) FROM news.articles;").Should()
                .Be(0); //DB should be empty when create failed
        }
    }

    [TestCase("aslkdjlksadj", "Bob", "sadjsalkdj", "salkdjlsakdjskladjlk")]
    public async Task ApiShouldRejectArticleWhenHeadlineAlreadyExists(string headline, string author, string imgurl,
        string body)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        var testArticle = new Article()
        {
            ArticleId = 1, ArticleImgUrl = imgurl, Author = author, Body = body, Headline = headline
        };
        using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.Execute(
                "INSERT INTO news.articles (headline, body, author, articleimgurl) VALUES (@headline, @body, @author, @imgurl) RETURNING *;",
                new { headline, author, imgurl, body });
        }

        //ACT
        var httpResponse = await new HttpClient().PostAsJsonAsync(Helper.ApiBaseUrl + "/articles", testArticle);


        //ASSERT
        httpResponse.Should().HaveError();
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.ExecuteScalar<int>("SELECT COUNT(*) FROM news.articles;").Should()
                .Be(1); //DB should have just the pre-existing article, and not also the new one
        }
    }*/

  
}