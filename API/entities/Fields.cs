using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.entities;

public class Fields
{
    public required int Id { get; set; }
    public required string Name { get; set; }
    public List<Doctors> Doctors { get; set; } 

}
