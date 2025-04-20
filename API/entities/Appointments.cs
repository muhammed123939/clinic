using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.entities;

public class Appointments
{    
    public required int Id { get; set; }

    [ForeignKey("Doctors")]
    public int DoctorId { get; set; }

    [ForeignKey("Patients")]
    public int PatientId { get; set; }

     [ForeignKey("Admins")]
    public int AdminId { get; set; }
    public string patientcase { get; set; }
    public string patientcomment { get; set; }
    public required DateOnly Date { get; set; }
    public required TimeOnly Time { get; set; }
    
    public  Admins Admins{ get; set; }
    public  Doctors Doctors{ get; set; }
    public  Patients Patients{ get; set; }

}
