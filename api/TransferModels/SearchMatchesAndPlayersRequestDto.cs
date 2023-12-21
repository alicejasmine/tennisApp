using System.ComponentModel.DataAnnotations;

namespace api.TransferModels;

public class SearchMatchesAndPlayersRequestDto
{
        [MinLength(2)]
        public string? SearchTerm { get; set; }
}