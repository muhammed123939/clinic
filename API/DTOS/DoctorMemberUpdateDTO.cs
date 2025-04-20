using System;

namespace API.DTOS;

public class DoctorMemberUpdateDTO
{
    public int id { get; set; }
    public string? name { get; set; }
    public DateTime DateOfBirth { get; set; }
    public int fieldId { get; set; }
    public int adminId { get; set; }
    public int doctorprice { get; set; }

    public byte[] passwordHash { get; set; } = [];
    public byte[] passwordSalt { get; set; } = [];
}
