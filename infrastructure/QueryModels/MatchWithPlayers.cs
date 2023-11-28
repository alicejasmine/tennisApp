using System.Data.SqlTypes;

namespace infrastructure.DataModels;

public class MatchWithPlayers
{
    public int Id { get; set; }
    public string Environment { get; set; }
    public string Surface { get; set; }
    public DateTime Date { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool Finished { get; set; }
    public string Notes { get; set; }
    public int PlayerId1 { get; set; }
    public int PlayerId2 { get; set; }
}