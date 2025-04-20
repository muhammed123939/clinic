using System;

namespace API.DTOS;

public class PatientloginDTO
{
   public required int Id { get; set; }
    public required string name { get; set; }
   public required string Token { get; set; }
}
