﻿using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using api.CustomDataAnnotations;

namespace api.TransferModels.ShotDtos;

public class CreateShotRequestDto
{
    [ValueIsOneOf(new string[] {"Winner", "Forced Error", "Unforced Error"},
        "Value must be one of these choices: Winner, Forced Error, or Unforced Error.")]
    public string? ShotClassification { get; set; }
    
    [ValueIsOneOf(new string[]{
        "Forehand Groundstroke", "Forehand Volley", "Forehand Return", 
        "Backhand Groundstroke", "Backhand Volley", "Backhand Return", 
        "Overhead", "Serve Deuce", "Serve Add", "Other"})]
    public string? ShotType { get; set; }
    
    [ValueIsOneOf(new string[]{"Net", "Wide", "Long", "Not Applicable"})]
    public string? ShotDestination { get; set; }
    
    [ValueIsOneOf(new string[]{"Middle", "Down The Line", "Cross Court"})]
    public string? ShotDirection { get; set; }
    
    [ValueIsOneOf(new string[]{"Red", "Yellow", "Green"})]
    public string? PlayerPostion { get; set; }
}