using System.ComponentModel.DataAnnotations;

namespace api.TransferModels;

public class CreatePlayerRequestDto
{
    
    [Required]
    [MaxLength(50)]
    public string FullName { get; set; }
    [Required]
    public bool Active { get; set; }
}