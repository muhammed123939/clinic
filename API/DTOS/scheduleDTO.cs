using System;

namespace API.DTOS;

public class scheduleDTO
{   
     public DayOfWeek DayOfWeek { get; set; }
    // Time only (no date)
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
}
