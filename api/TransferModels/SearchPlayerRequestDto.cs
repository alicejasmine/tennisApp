using System.ComponentModel.DataAnnotations;

namespace api.TransferModels;

public class SearchPlayerRequestDto
{
    [MinLength(3)]
    public string? SearchTerm { get; set; }
    
}