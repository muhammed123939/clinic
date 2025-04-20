using API.entities;

namespace API.interfaces;

public interface ItokenService
{
 string CreateToken (Admins admin);
 string CreateTokenDoctor (Doctors doctor);
 string CreateTokenPatient (Patients patient);
 
}
