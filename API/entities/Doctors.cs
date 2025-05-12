using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
namespace API.entities;

public class Doctors
{
    public required int Id { get; set; }
    public required string Name { get; set; }
    public required byte[] PasswordHash { get; set; } = [];
    public required byte[] PasswordSalt { get; set; } = [];
    public required DateTime DateOfBirth { get; set; }
    public required int DoctorPrice { get; set; }

    [ForeignKey("Fields")]
    public int? FieldId { get; set; } 

    [ForeignKey("Admins")]
    public int? AdminId { get; set; }
    
    public Fields Fields { get; set; } 
    public Admins Admins { get; set; } 
    public Photos Photos { get; set; } 
    public List<Appointments> appointments { get; set; } = [];

    public ICollection<Schedule> Schedules { get; set; }
    public ICollection<Patients> Patients { get; set; } =null!;
    public ICollection<CaseDescription> CaseDescription { get; set; } =null!;
  
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
