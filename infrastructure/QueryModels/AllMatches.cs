namespace infrastructure.QueryModels;

public class AllMatches
{
    public int Id { get; set; }
    public string Environment { get; set; }
    public string Surface { get; set; }
    public string Date { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public bool Finished { get; set; }
    public string Notes { get; set; }
}