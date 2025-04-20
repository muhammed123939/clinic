using System;

namespace API.DTOS;

public class AdminDTO
{
    public required int Id { get; set; }
    public required string Username { get; set; }
    public required string Token { get; set; }
    public required bool Cando { get; set; }
    public  int Store_Id { get; set; }

}
