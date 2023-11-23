namespace api.TransferModels;

public class UpdateMatchRequestDto
{
    public string Environment { get; set; }

    public string Surface { get; set; }
    
    public DateTime Date { get; set; }
    
    public DateTime StartTime { get; set; }
    
    public DateTime EndTime { get; set; }
    
    public bool Finished { get; set; }
    
    public string Notes { get; set; }
}