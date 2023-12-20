namespace tests;

public class Shot
{
    public int ShotsId { get; set; }
    public int PlayerId { get; set; }
    public int MatchId { get; set; }
    public required string ShotClassification { get; set; }
    public required string ShotType { get; set; }
    public required string ShotDestination { get; set; }
    public required string ShotDirection { get; set; }
    public required string PlayerPosition { get; set; }
}