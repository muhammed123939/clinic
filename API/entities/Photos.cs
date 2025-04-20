using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.entities;

public class Photos
{
    [Key]
    public int Id { get; set; }
    public required string Url { get; set; }
    public required string publicId { get; set; }

    [ForeignKey("Doctors")]
    public int DoctorId { get; set; }

    public Doctors Doctors { get; set; } 
}
