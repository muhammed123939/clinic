using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
namespace API.entities;

public class Patients
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Gender { get; set; }
    public required string MobileNumber { get; set; }
    public string NationalNumber { get; set; }
    public required DateTime DateOfBirth { get; set; }
    public  byte[]? PasswordHash { get; set; } = [];
    public  byte[]? PasswordSalt { get; set; } = [];
    
    [ForeignKey("Admins")]
    public  int AdminId { get; set;}

    public  Admins Admins{ get; set; }
     public List<Appointments> appointments { get; set; } = [];
    public ICollection<CaseDescription> CaseDescription{get;set ;}=null!;
    public ICollection<Doctors> Doctors { get; set; }=null!;


    [NotMapped] // This property will not be stored in the database
    public int Age => CalculateAge();

    private int CalculateAge()
    {
        var today = DateTime.Today;
        var age = today.Year - DateOfBirth.Year;
        if (DateOfBirth.Date > today.AddYears(-age)) 
            age--;
        return age;
    }
}
