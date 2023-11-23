using System.ComponentModel.DataAnnotations;

namespace api.TransferModels;

public class CreatePlayerRequestDto
{
   
    [Required]
    public string FullName { get; set; }
    public bool Active { get; set; }
}