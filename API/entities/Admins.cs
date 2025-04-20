using System.ComponentModel.DataAnnotations.Schema;


namespace API.entities;

public class Admins
{
    public required int Id { get; set; }
    public required string Name { get; set; }
    public byte[] PasswordHash { get; set; } = [];
    public byte[] PasswordSalt { get; set; } = [];
    public bool CanDo { get; set; }
    
    [ForeignKey("Store")]
    [Column("Store_Id")]
    public int storeId { get; set; }

    public Store store { get; set; }
    public List<Orders> orders { get; set; }
    public List<Doctors> Doctors { get; set; } =[];
    public List<Appointments> appointments { get; set; } 
    public List <Patients> Patients { get; set; } 

}
