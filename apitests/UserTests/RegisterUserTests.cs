using System.Net;
using System.Net.Http.Json;
using apitests.Models;
using Dapper;
using FluentAssertions;
using NUnit.Framework;

namespace apitests.UserTests;


public class RegisterUserTests
{
    // tests that an account can successfully be registered by checking if the object exists serverside
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
    
    // should fail register based on too short of a password
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
    
    // Register and login with an account
    [TestCase("Jeff Lebowski", "TheBigLB@bowlinglane.com", "ItWasANiceRug")]
    [TestCase("Jules Winnfield", "SayWhatAgain@pulp.com", "RoyaleWithCheese")]
    public async Task LoginFromHttp(string fullName, string email, string password)
    {
        Helper.TriggerRebuild();

        var testRegister = new RegisterUser()
        {
            FullName = fullName,
            Email = email,
            Password = password
        };

        var testLogin = new LoginUser()
        {
            Email = email,
            Password = password
        };
        
        var httpRegister =
            await new HttpClient().PostAsJsonAsync(Helper.ApiBaseUrl + "/account/register", testRegister);

        var httpLogin = await new HttpClient().PostAsJsonAsync(Helper.ApiBaseUrl + "/account/login", testLogin);

        httpRegister.StatusCode.Should().Be(HttpStatusCode.NoContent);
        httpLogin.StatusCode.Should().Be(HttpStatusCode.OK);
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.ExecuteScalar<int>("SELECT COUNT(*) FROM tennis_app.users;").Should().Be(1); // Checking the Object exists server side
            
        }
    }
    
    // should fail register based on an incorrect password or email
    [TestCase("Jeff Lebowski", "TheBigLB@bowlinglane.com", "ItWasANiceRug", "TheBigLB@bowlinglane.com", "thedude")]
    [TestCase("Jules Winnfield", "SayWhatAgain@pulp.com", "RoyaleWithCheese", "saywhatagain", "RoyaleWithCheese")]
    public async Task FailStateLoginFromHttp(string fullName, string email, string password, string loginEmail, string loginPassword)
    {
        Helper.TriggerRebuild();

        var testRegister = new RegisterUser()
        {
            FullName = fullName,
            Email = email,
            Password = password
        };
        
        var testLogin = new LoginUser()
        {
            Email = loginEmail,
            Password = loginPassword
        };

        
        
        var httpRegister =
            await new HttpClient().PostAsJsonAsync(Helper.ApiBaseUrl + "/account/register", testRegister);
        
        
        var httpLogin = await new HttpClient().PostAsJsonAsync(Helper.ApiBaseUrl + "/account/login", testLogin);
        
        
        httpRegister.StatusCode.Should().Be(HttpStatusCode.NoContent); // user creating is still successful as that is not what we are testing
        httpLogin.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.ExecuteScalar<int>
                ("SELECT COUNT(*) FROM tennis_app.users;").Should().Be(1); // Checking the Object does not exist server side
        }
    }
}