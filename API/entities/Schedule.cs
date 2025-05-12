using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.entities;

public class Schedule
{
  public int Id { get; set; }

    // Foreign Key to Doctor
    public int DoctorId { get; set; }
    
    [ForeignKey("Doctors")]
    public Doctors Doctor { get; set; }

    // Enum for day of week (e.g., Monday, Tuesday, etc.)
    public DayOfWeek DayOfWeek { get; set; }

    // Time only (no date)
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
}
