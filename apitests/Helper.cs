using Dapper;
using Newtonsoft.Json;
using Npgsql;
using NUnit.Framework;


namespace apitests;

public class Helper
{
    public static readonly NpgsqlDataSource DataSource;
    public static readonly string ApiBaseUrl = "http://localhost:5000/api";
    

    static Helper()
    {
        var envVarKeyName = "pgconn";

        var rawConnectionString = Environment.GetEnvironmentVariable(envVarKeyName)!;
        if (rawConnectionString == null)
        {
            throw new Exception($@"YOUR CONN STRING PGCONN IS EMPTY.");
        }

        try
        {
            var uri = new Uri(rawConnectionString);
            var properlyFormattedConnectionString = string.Format(
                "Server={0};Database={1};User Id={2};Password={3};Port={4};Pooling=false;",
                uri.Host,
                uri.AbsolutePath.Trim('/'),
                uri.UserInfo.Split(':')[0],
                uri.UserInfo.Split(':')[1],
                uri.Port > 0 ? uri.Port : 5432);
            DataSource =
                new NpgsqlDataSourceBuilder(properlyFormattedConnectionString).Build();
            DataSource.OpenConnection().Close();
        }
        catch (Exception e)
        {
            throw new Exception($@"Your connection string is found, but could not be used.", e);
        }
    }
    
    public static string BadResponseBody(string content)
    {
        return $@"There was an issue fetching the response body from the API and turning it into a class object.
        Reponse Body: {content}

        EXCEPTION:
        ";
    }
    
    public static string NoResponseMessage = $@"
There was no response from the API, the API may not be running.
    ";


    public static void TriggerRebuild()
    {
        using (var conn = DataSource.OpenConnection())
        {
            try
            {
                conn.Execute(RebuildScript);
            }
            catch (Exception e)
            {
                throw new Exception($@"
THERE WAS AN ERROR REBUILDING THE DATABASE.", e);
            }
        }
    }


    public static string RebuildScript = @"
DROP SCHEMA IF EXISTS tennis_app CASCADE;

CREATE SCHEMA tennis_app;

create table if not exists tennis_app.players
(
    player_id serial PRIMARY KEY,
    full_name VARCHAR (50) NOT NULL,
    active boolean NOT NULL default true
);

create table if not exists tennis_app.match
(
    match_id serial PRIMARY KEY,
    environment VARCHAR(50) NOT NULL,
    surface VARCHAR(50) NOT NULL,
    date date NOT NULL,
    start_time timestamp,
    end_time timestamp,
    finished boolean NOT NULL DEFAULT false
    notes VARCHAR(250)
);

create table if not exists tennis_app.played_in
(
    player_id int NOT NULL,
    match_id int NOT NULL,
    PRIMARY KEY (player_id, match_id),
    FOREIGN KEY (player_id)
      REFERENCES tennis_app.players (player_id) ON DELETE CASCADE,
    FOREIGN KEY (match_id)
      REFERENCES tennis_app.match (match_id) ON DELETE CASCADE
);

create table if not exists tennis_app.shots
(
    shots_id serial PRIMARY KEY,
    player_id int NOT NULL,
    match_id int NOT NULL,
    shot_classification VARCHAR(50) NOT NULL,
    shot_type VARCHAR(50) NOT NULL,
    shot_destination VARCHAR(50) NOT NULL,
    shot_direction VARCHAR(50) NOT NULL,
    player_position VARCHAR(50) NOT NULL,
    FOREIGN KEY (player_id)
      REFERENCES tennis_app.players (player_id) ON DELETE CASCADE,
    FOREIGN KEY (match_id)
      REFERENCES tennis_app.match (match_id) ON DELETE CASCADE
);

create table if not exists tennis_app.users
(
    id serial PRIMARY KEY,
    full_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    admin boolean NOT NULL DEFAULT false
);

create table if not exists tennis_app.password_hash
(
  user_id integer,
  hash VARCHAR(350) NOT NULL,
  salt VARCHAR(180) NOT NULL,
  algorithm VARCHAR(12) NOT NULL,
  FOREIGN KEY (user_id)
      REFERENCES tennis_app.users (id) ON DELETE CASCADE
);
 ";

    
}

