using System.ComponentModel.DataAnnotations;

namespace api.TransferModels;

public class CreatePlayerRequestDto
{
   
    [Required]
    public string FullName { get; set; }
    [Required]
    public bool Active { get; set; }
}