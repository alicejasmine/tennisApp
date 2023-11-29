using System.ComponentModel.DataAnnotations;
using api.CustomDataAnnotation;

namespace api.TransferModels;

public class CreateMatchRequestDto
{
    [Required]
    [ValueIsOneOf(new string[] {"indoor", "outdoor"}, "Must be indoor or outdoor!")]
    public string Environment { get; set; }
    
    [Required]
    [ValueIsOneOf(new string[] {"clay", "hard", "other"}, "Must be clay, hard or other!")]
    public string Surface { get; set; }
    
    [Required]
    public DateTime Date { get; set; }
    
    public DateTime StartTime { get; set; }
    
    public DateTime EndTime { get; set; }
    
    public bool Finished { get; set; }
    
    [StringLength(251)]
    public string Notes { get; set; }
    
    [Required]
    public int PlayerId1 { get; set; }
    
    [Required]
    public int PlayerId2 { get; set; }
}