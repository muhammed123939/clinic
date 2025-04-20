using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOS;

public class RegisterPatientDTO
{
    public int Id { get; set; }
    public string? name { get; set; } = string.Empty;
   
    public string? gender { get; set; } = string.Empty;
    public string? mobile { get; set; } = string.Empty;
    public DateTime  DateOfBirth { get; set; } 
    public int adminId { get; set; }
    public string nationalNumber { get; set; }
}



