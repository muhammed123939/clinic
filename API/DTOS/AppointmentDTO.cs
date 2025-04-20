using System;

namespace API.DTOS;

public class AppointmentDTO
{

    public int Id { get; set; }
    public int DoctorId { get; set; }
    public int AdminId { get; set; }
    public int PatientId { get; set; }
    public string? Patientcase { get; set;}
    public string? Patientcomment { get; set;}

    public DateOnly  Date { get; set; } 
    public TimeOnly Time { get; set; } 
}
