using System.Net;
using System.Net.Http.Json;
using apitests.Models;
using Dapper;
using FluentAssertions;
using NUnit.Framework;

namespace apitests.UserTests;


public class RegisterUserTests
{
    [TestCase("Jeff Lebowski", "TheBigLB@bowlinglane.com", "ItWasANiceRug")]
    [TestCase("Jules Winnfield", "SayWhatAgain@pulp.com", "RoyaleWithCheese")]
    public async Task RegisterUserFromHttp(string fullName, string email, string password)
    {
        Helper.TriggerRebuild();

        var testRegister = new RegisterUser()
        {
            FullName = fullName,
            Email = email,
            Password = password
        };
        
        var httpResponse =
            await new HttpClient().PostAsJsonAsync(Helper.ApiBaseUrl + "/account/register", testRegister);


        httpResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.ExecuteScalar<int>("SELECT COUNT(*) FROM tennis_app.users;").Should().Be(1); // Checking the Object exists server side
            
        }
    }
    
    [TestCase("Jeff Lebowski", "TheBigLB@bowlinglane.com", "TheDude")]
    [TestCase("Jules Winnfield", "SayWhatAgain", "Royale")]
    public async Task FailStateRegisterUserFromHttp(string fullName, string email, string password)
    {
        Helper.TriggerRebuild();

        var testRegister = new RegisterUser()
        {
            FullName = fullName,
            Email = email,
            Password = password
        };
        
        var httpResponse =
            await new HttpClient().PostAsJsonAsync(Helper.ApiBaseUrl + "/account/register", testRegister);


        httpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.ExecuteScalar<int>
                ("SELECT COUNT(*) FROM tennis_app.users;").Should().Be(0); // Checking the Object does not exist server side
        }
    }
}