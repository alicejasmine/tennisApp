using System.ComponentModel.DataAnnotations;

namespace api.TransferModels;

public class UpdatePlayerRequestDto
{
    [Required]
    [MaxLength(50)]
    public string FullName { get; set; }
    [Required]
    public bool Active { get; set; }
}