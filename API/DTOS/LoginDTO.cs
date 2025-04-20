using System;

namespace API.DTOS;

public class LoginDTO
{
    public required string Name { get; set; }
    public required string Password { get; set; }
}
