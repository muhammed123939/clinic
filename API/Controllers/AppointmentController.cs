using API.Data;
using API.DTOS;
using API.entities;
using API.interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AppointmentController(DataContext context, IAppointmentRepository appointmentRepository, IMapper mapper) : BaseApiController
    {
        private List<TimeSlot> GenerateTimeSlots(TimeSpan start, TimeSpan end, TimeSpan interval)
        {
            var slots = new List<TimeSlot>();
            var current = start;

            while (current + interval <= end)
            {
                slots.Add(new TimeSlot
                {
                    Start = current,
                    End = current + interval
                });

                current += interval;
            }

            return slots;
        }

        [HttpGet("GetAvailableSlots")]
        public async Task<List<TimeSlot>> GetAvailableSlots(int doctorId, DateTime date)
        {
            var schedule = await context.Schedules
                .Where(s => s.DoctorId == doctorId && s.DayOfWeek == date.DayOfWeek)
                .FirstOrDefaultAsync();

            if (schedule == null) return new List<TimeSlot>();

            var dateOnly = DateOnly.FromDateTime(date);

            var appointments = await context.Appointments
                .Where(a => a.DoctorId == doctorId && a.Date == dateOnly)
                .ToListAsync();

            var slots = GenerateTimeSlots(schedule.StartTime, schedule.EndTime, TimeSpan.FromMinutes(30));

            foreach (var appt in appointments)
            {
                slots.RemoveAll(s => s.Start == appt.Time.ToTimeSpan()); // ✅ both are TimeSpan now

            }

            return slots;
        }

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
                    Time = a.Time,
                    Patientcomment = a.patientcomment
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

        [HttpGet("doctorschedule/{id}")]
        public async Task<ActionResult<IEnumerable<scheduleDTO>>> GetDoctorSchedule(int id)
        {
        var schedule = await context.Schedules
        .Where(s => s.DoctorId == id)
        .Select(s => new scheduleDTO
        {
            DayOfWeek = s.DayOfWeek,
            StartTime = s.StartTime,
            EndTime = s.EndTime
        })
        .ToListAsync();

         if (schedule.Any())
         {
        return Ok(schedule);
        }
        else
         {
         return BadRequest("Cannot find schedule for the doctor");
        }
        }

        [HttpPost("registerappointment")]
        public async Task<ActionResult> Registerappointments(AppointmentDTO appointmentDTO)
        {
            // 1. Check if there's a valid schedule for this doctor on that day
            var schedule = await context.Schedules
                .FirstOrDefaultAsync(s => s.DoctorId == appointmentDTO.DoctorId
                    && s.DayOfWeek == appointmentDTO.Date.DayOfWeek);

            if (schedule == null)
            {
                return BadRequest("Doctor is not scheduled on this day.");
            }

            var appointmentTime = new TimeOnly(appointmentDTO.Time.Hour, appointmentDTO.Time.Minute);

            // Convert TimeOnly to TimeSpan (ticks based from midnight)
            TimeSpan appointmentTimeSpan = appointmentTime.ToTimeSpan();
            TimeSpan scheduleStartTimeSpan = schedule.StartTime;
            TimeSpan scheduleEndTimeSpan = schedule.EndTime;

            // Check if the appointment time is within the doctor's working hours
            if (appointmentTimeSpan < scheduleStartTimeSpan || appointmentTimeSpan >= scheduleEndTimeSpan)
            {
                return BadRequest("Appointment time is outside of the doctor's working hours.");
            }
        
                var appointmentStart = TimeOnly.FromTimeSpan(appointmentTimeSpan);
                var appointmentEnd = appointmentStart.AddMinutes(15); // or any custom duration

                // Pull potential conflicts into memory, then filter
                var appointments = await context.Appointments
                    .Where(a =>
                        a.DoctorId == appointmentDTO.DoctorId &&
                        a.Date == appointmentDTO.Date)
                    .ToListAsync();

                // Check for overlap in-memory
                var isSlotTaken = appointments.Any(a =>
                {
                    var existingStart = a.Time;
                    var existingEnd = existingStart.AddMinutes(15); // assuming 15-min appointment
                    return existingStart < appointmentEnd && existingEnd > appointmentStart;
                });

                if (isSlotTaken)
                {
                    return BadRequest("This time slot is already booked.");
                }


            // 4. All good, map and save the appointment
            var newappointment = mapper.Map<Appointments>(appointmentDTO);
            newappointment.AdminId = appointmentDTO.AdminId;
            newappointment.DoctorId = appointmentDTO.DoctorId;
            newappointment.PatientId = appointmentDTO.PatientId;
            newappointment.Date = appointmentDTO.Date;
            newappointment.Time = appointmentDTO.Time;
            newappointment.patientcase = "";
            newappointment.patientcomment = "";

            context.Appointments.Add(newappointment);
            await context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("getappointment/{id}")]
        public async Task<ActionResult<AppointmentDTO>> getappointment(int id)
        {
            var appointment = await appointmentRepository.GetAppointmentsById(id);

            if (appointment != null)
            {
                return Ok(appointment);
            }

            else
            {
                return BadRequest("cannot find appointment");
            }
        }


        [HttpGet("GetAppointmentsByPatientedit/{appointmentId}/{patientId}")]
        public async Task<ActionResult<List<AppointmentDTO>>> GetAppointmentsByPatientedit(int appointmentId, int patientId)
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
                    Patientcase = a.patientcase,
                    Patientcomment = a.patientcomment
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
                    Patientcase = a.patientcase,
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