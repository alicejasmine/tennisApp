using Dapper;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace tests;

public class DeleteMatchUi : PageTest
{
    [Test]
    public async Task MatchCanBeSuccessfullyDeletedFromUi() {

        
        //ARRANGE
        Helper.TriggerRebuild();
        
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.Query(
                "INSERT INTO tennis_app.match (environment, surface, date, start_time, end_time, finished, notes) VALUES ('outdoor', 'clay', '2001-01-01', '2001-01-02 10:10:10', '2001-01-03 11:11:11', true, 'hardcodedNote') RETURNING *;" +
                "insert into tennis_app.players(full_name)VALUES('Aleksandra Kurdelska');" +
                "insert into tennis_app.players(full_name)VALUES('Bob Pancakes');" +
                "INSERT INTO tennis_app.played_in (player_id, match_id) VALUES (1,1);" +
                "INSERT INTO tennis_app.played_in (player_id, match_id) VALUES (2,1);");
        }
        
        //ACT
        
    }
}