using System;
using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincibleExtensions
{
    
  public static string GetAdminname (this ClaimsPrincipal admin)
    {
        var adminname = admin.FindFirstValue(ClaimTypes.NameIdentifier) 
       ?? throw new Exception ("cannot get Admin name from token");
        return adminname ; 
    }
  public static string doctorname (this ClaimsPrincipal doctor)
    {
        var doctorname = doctor.FindFirstValue(ClaimTypes.NameIdentifier) 
       ?? throw new Exception ("cannot get doctor name from token");
        return doctorname ; 
    }
}
