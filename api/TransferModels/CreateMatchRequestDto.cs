using System.ComponentModel.DataAnnotations;
using api.CustomDataAnnotations;

namespace api.TransferModels;

public class CreateMatchRequestDto
{
    [Required]
    [ValueIsOneOf(new string[] {"indoor", "outdoor"}, "Must be indoor or outdoor!")]
    public string? Environment { get; set; }
    
    [Required]
    [ValueIsOneOf(new string[] {"clay", "hard", "other"}, "Must be clay, hard or other!")]
    public string? Surface { get; set; }
    
    [Required]
    [RegularExpression(@"^\d{4}-((0\d)|(1[012]))-(([012]\d)|3[01])$")]
    public string? Date { get; set; }
    
    [RegularExpression(@"^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$")]
    public string? StartTime { get; set; }
    
    [RegularExpression(@"^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$")]
    public string? EndTime { get; set; }
    
    public bool Finished { get; set; }
    
    [StringLength(251)]
    public string? Notes { get; set; }
}