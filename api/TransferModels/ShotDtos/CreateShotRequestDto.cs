using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using api.CustomDataAnnotations;

namespace api.TransferModels.ShotDtos;

public class CreateShotRequestDto
{
    
    [NotNull]
    [ValueIsOneOf(new string[] {"Winner", "Forced Error", "Unforced Error"},
        "Value must be one of these choices: Winner, Forced Error, or Unforced Error.")]
    public string? ShotClassification { get; set; }
    [NotNull]
    [ValueIsOneOf(new string[]{
        "Forehand Groundstroke", "Forehand Volley", "Forehand Return", 
        "Backhand Groundstroke", "Backhand Volley", "Backhand Return", 
        "Overhead", "Serve Deuce", "Serve Add", "Other"},
        "Valid elements are Forehand Groundstroke, " +
        "Forehand Volley, Forehand Return, Backhand Groundstroke, " +
        "Backhand Volley, Backhand Return, Overhead, Serve Deuce, Serve Add, Other")]
    public string? ShotType { get; set; }
    [NotNull]
    [ValueIsOneOf(new string[]{"Net", "Wide", "Long", "Not Applicable"}, "Valid elements are Wide, Long, Net, and Not Applicable")]
    public string? ShotDestination { get; set; }
    [NotNull]
    [ValueIsOneOf(new string[]{"Middle", "Down The Line", "Cross Court"},"Valid elements are Middle, Down The Line, and Cross Court")]
    public string? ShotDirection { get; set; }
    [NotNull]
    [ValueIsOneOf(new string[]{"Red", "Yellow", "Green"},"Valid elements are Red, Yellow, and Green")]
    public string? PlayerPosition { get; set; }
}