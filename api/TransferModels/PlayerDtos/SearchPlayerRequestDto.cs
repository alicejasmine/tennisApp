using System.ComponentModel.DataAnnotations;

namespace api.TransferModels.PlayerDtos;

public class SearchPlayerRequestDto
{
    [MinLength(3)]
    public string? SearchTerm { get; set; }
    
}