using System.ComponentModel.DataAnnotations;

namespace api.TransferModels.PlayerDtos;

public class CreatePlayerRequestDto
{
    
    [Required]
    [MaxLength(50)]
    public string FullName { get; set; }
    
}