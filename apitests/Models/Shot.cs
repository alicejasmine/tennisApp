namespace apitests;

public class Shot
{
    public int ShotsId { get; set; }
    public int PlayerId { get; set; }
    public int MatchId { get; set; }
    public string ShotClassification { get; set; }
    public string ShotType { get; set; }
    public string ShotDestination { get; set; }
    public string ShotDirection { get; set; }
    public string PlayerPosition { get; set; }
}