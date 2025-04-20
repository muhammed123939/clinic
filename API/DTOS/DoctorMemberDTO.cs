using System;

namespace API.DTOS;

public class DoctorMemberDTO
{
    public int id { get; set; }
    public string? name { get; set; }
    public int age { get; set; }    
    public DateTime DateOfBirth { get; set; }
    public int fieldId { get; set; }
    public int adminId { get; set; }
    public string? password { get; set; }
    public int doctorPrice { get; set; }
}

