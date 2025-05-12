using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOS;

public class RegisterDoctorDTO
{
    [Required]
    public string? doctorname { get; set; } = string.Empty;

    [Required]
    [StringLength(8, MinimumLength = 4)]
    public string doctorpassword { get; set; } = string.Empty;

    [Required] public DateTime DateOfBirth { get; set; }
    [Required] public int adminId { get; set; }
    [Required] public int fieldId { get; set; }
    [Required] public int doctorprice { get; set; }
    
    public List<int> AvailableDays { get; set; }   // e.g., [0,1,3] for Sunday, Monday, Wednesday
    public string StartTime { get; set; }          // e.g., "09:00"
    public string EndTime { get; set; }    
}
