using API.Data;
using API.DTOS;
using API.entities;
using API.interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AppointmentController(DataContext context, IAppointmentRepository appointmentRepository, IMapper mapper) : BaseApiController
    {

        [HttpGet("getDoctors")]
        public async Task<ActionResult<IEnumerable<AdminAddedDoctorDTO>>> getDoctors()
        {
            var doctors = context.Doctors.FromSqlInterpolated($"SELECT d.Id, d.Name FROM Doctors d JOIN Appointments a ON a.DoctorId = d.Id GROUP BY a.Id").Select(e => new AdminAddedDoctorDTO
            {
                id = e.Id,
                name = e.Name
            })
    .ToList();
            return Ok(doctors);
        }

        [HttpGet("getPatients")]
        public async Task<ActionResult<IEnumerable<AdminAddedDoctorDTO>>> getPatients()
        {
            var patients = context.Patients.FromSqlInterpolated($"SELECT p.Id, p.Name FROM Patients p JOIN Appointments a ON a.PatientId = p.Id GROUP BY a.Id").Select(e => new AdminAddedDoctorDTO
            {
                id = e.Id,
                name = e.Name
            })
    .ToList();
            return Ok(patients);
        }

        [HttpGet("getAdmins")]
        public async Task<ActionResult<IEnumerable<AdminAddedDoctorDTO>>> getAdmins()
        {
            var admins = context.Admin.FromSqlInterpolated($"SELECT a.Id, a.Name FROM Admin a JOIN Appointments a2  ON a2.AdminId = a.Id GROUP BY a2.Id").Select(e => new AdminAddedDoctorDTO
            {
                id = e.Id,
                name = e.Name
            })
    .ToList();
            return Ok(admins);
        }

        [HttpGet("adminappointments/{date}")]
        public async Task<IActionResult> GetAppointments(DateOnly date)
        {
            var appointments = await context.Appointments
                .FromSqlInterpolated($"SELECT * FROM Appointments WHERE Date = {date}")
                .Select(a => new AppointmentDTO
                {
                    Id = a.Id,
                    DoctorId = a.DoctorId,
                    PatientId = a.PatientId,
                    AdminId = a.AdminId,
                    Date = a.Date,
                    Time = a.Time , 
                    Patientcomment=a.patientcomment
                })
                .ToListAsync();


            if (!appointments.Any())
            {
                return NotFound("No appointments found for the specified date.");
            }
            else
            {
                return Ok(appointments);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAppointment(int id)
        {

            var appointment = await appointmentRepository.GetAppointmentsById(id);

            if (appointment == null) return NotFound();

            else
            {
                appointmentRepository.delete(appointment);
                await appointmentRepository.SaveAllAsync();
                return Ok();
            }
        }

        [HttpGet("doctorappointments")]
        public async Task<IEnumerable<AppointmentDTO>> GetAppointments(int doctorid)
        {
            return await context.Appointments
            .ProjectTo<AppointmentDTO>(mapper.ConfigurationProvider)
            .ToListAsync();
        }

        [HttpPost("registerappointment")] //acount/register     
        public async Task<ActionResult> Registerappointments(AppointmentDTO appointmentDTO)
        {
            var newappointment = mapper.Map<Appointments>(appointmentDTO);
            newappointment.AdminId = appointmentDTO.AdminId;
            newappointment.DoctorId = appointmentDTO.DoctorId;
            newappointment.PatientId = appointmentDTO.PatientId;
            newappointment.Date = appointmentDTO.Date;
            newappointment.Time = appointmentDTO.Time;
            newappointment.patientcase ="";
            newappointment.patientcomment ="";
            context.Appointments.Add(newappointment);
            await context.SaveChangesAsync();
            return Ok();

        }

        [HttpGet("getappointment/{id}")]
        public async Task<ActionResult<AppointmentDTO>> getappointment(int id)
        {
            var appointment = await appointmentRepository.GetAppointmentsById(id);
          
           if(appointment!=null){
            return Ok(appointment);
            }

            else{
                return BadRequest("cannot find appointment");
            }
        }
      
      
[HttpGet("GetAppointmentsByPatientedit/{appointmentId}/{patientId}")]
public async Task<ActionResult<List<AppointmentDTO>>> GetAppointmentsByPatientedit(int appointmentId , int patientId )
{

    var appointment = await context.Appointments
        .FromSqlInterpolated($"SELECT * FROM Appointments WHERE PatientId = {patientId} AND Id = {appointmentId}")
        .Select(a => new AppointmentDTO
        {
            Id = a.Id,
            DoctorId = a.DoctorId,
            PatientId = a.PatientId,
            AdminId = a.AdminId,
            Date = a.Date,
            Time = a.Time,
            Patientcase = a.patientcase , 
            Patientcomment= a.patientcomment
        })
        .FirstOrDefaultAsync(); 
    if (appointment != null)
    {
        return Ok(appointment);
    }
    else
    {
        return BadRequest("Cannot find appointment or you shall not pass");
    }
} 


     
[HttpGet("GetAppointmentsByPatient/{patientId}")]
public async Task<ActionResult<List<AppointmentDTO>>> GetAppointmentsByPatient(int patientId)
{
    var appointments = await context.Appointments
        .FromSqlInterpolated($"SELECT * FROM Appointments WHERE PatientId = {patientId}")
        .Select(a => new AppointmentDTO
        {
            Id = a.Id,
            DoctorId = a.DoctorId,
            PatientId = a.PatientId,
            AdminId = a.AdminId,
            Date = a.Date,
            Time = a.Time,
            Patientcase = a.patientcase,
            Patientcomment = a.patientcomment
        })
        .ToListAsync(); // 👈 Get a list instead of just the first item

    if (appointments.Any())
    {
        return Ok(appointments); // ✅ return as List<AppointmentDTO>
    }
    else
    {
        return NotFound("No appointments found.");
    }
}
      
[HttpGet("getappointment2/{idappointment}/{iddoctor}")]
public async Task<ActionResult<AppointmentDTO>> GetAppointmentByDoctor(int idappointment, int iddoctor)
{
    var appointment = await context.Appointments
        .FromSqlInterpolated($"SELECT * FROM Appointments WHERE DoctorId = {iddoctor} AND Id = {idappointment}")
        .Select(a => new AppointmentDTO
        {
            Id = a.Id,
            DoctorId = a.DoctorId,
            PatientId = a.PatientId,
            AdminId = a.AdminId,
            Date = a.Date,
            Time = a.Time,
            Patientcase = a.patientcase  ,
            Patientcomment = a.patientcomment
        })
        .FirstOrDefaultAsync(); // Execute the query and get the first result or null.

    if (appointment != null)
    {
        return Ok(appointment);
    }
    else
    {
        return BadRequest("Cannot find appointment or you shall not pass");
    }
}
        [HttpPut]
        public async Task<ActionResult> UpdateAppointmet(AppointmentDTO appointmentDTO)
        {

            var appointment = await appointmentRepository.GetAppointmentsById(appointmentDTO.Id);
            if (appointment == null) return BadRequest("could not find appointment");

            mapper.Map(appointmentDTO, appointment);

            if (await appointmentRepository.SaveAllAsync()) return NoContent();
            return BadRequest("failed to update the appointment");
        }

    }
}

