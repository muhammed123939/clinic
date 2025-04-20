using System.ComponentModel.DataAnnotations;
namespace API.entities;

public class CaseDescription
{
    [Key]
    public required int Id { get; set; }
    public required string Case { get; set; }
    public required DateTime TimeAdded { get; set; } = DateTime.UtcNow;

    public ICollection<Patients> Patients { get; set; } = null!;
    public ICollection<Doctors> Doctors { get; set; } = null!;
}
