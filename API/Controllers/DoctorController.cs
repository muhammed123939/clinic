using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOS;
using API.entities;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class DoctorController(IPhotoService photoService, IDoctorRepository doctorRepository,
     IMapper mapper, DataContext context) : BaseApiController
    {

        [HttpGet("Getappointments/{id}")]
        public async Task<IActionResult> GetAppointments(int id)
        {
            var appointments = await context.Appointments
                .FromSqlInterpolated($"SELECT * FROM Appointments WHERE DoctorId  =  {id}")
                .Select(a => new AppointmentDTO
                {
                    Id = a.Id,
                    DoctorId = a.DoctorId,
                    PatientId = a.PatientId,
                    AdminId = a.AdminId,
                    Date = a.Date,
                    Time = a.Time , 
                    Patientcase = a.patientcase
                    
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

        [HttpGet("Getphotos")]
        public async Task<ActionResult<IEnumerable<PhotoDTO>>> Getphotos()
        {
            var photos = context.Photos.FromSqlInterpolated
            ($"SELECT Id , Url from Photos p GROUP BY DoctorId").Select(e => new PhotoDTO
            {
                Id = e.Id,
                Url = e.Url
            })
    .ToList();

            return Ok(photos);
        }

        [HttpGet("Getdoctorphoto/{doctorId}")]
        public async Task<ActionResult<PhotoDTO>> Getdoctorphoto(int doctorId)
        {
            var photo = context.Photos.FromSqlInterpolated
            ($"SELECT Id , Url FROM Photos WHERE DoctorId ={doctorId}").Select(e => new PhotoDTO
            {
                Id = e.Id,
                Url = e.Url
            });

            return Ok(photo);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<DoctorMemberDTO>> Getudoctorbyid(int id)
        {
            var doctor = await doctorRepository.GetDoctorById(id);

            if (doctor != null)
            {
                return Ok(doctor);
            }

            else
            {
                return BadRequest("cannot find doctor");
            }
        }

        [HttpGet("adminaddedthedoctor")]
        public async Task<ActionResult<IEnumerable<AdminAddedDoctorDTO>>> adminaddedthedoctor()
        {
            var admins = context.Admin.FromSqlInterpolated
            ($"SELECT a.Id, a.Name FROM Admin a JOIN Doctors d ON d.AdminId = a.Id GROUP BY d.Id").Select(e => new AdminAddedDoctorDTO
            {
                id = e.Id,
                name = e.Name
            })
    .ToList();

            return Ok(admins);
        }

        [HttpGet("fieldsofdoctor")]
        public async Task<ActionResult<IEnumerable<FieldsDTO>>> fieldsofdoctor()
        {
            var fields = context.Fields.FromSqlInterpolated
            ($"SELECT f.Id, f.Name FROM Fields f JOIN Doctors d ON d.FieldId = f.Id GROUP BY d.Id ").ToList(); ;

            return Ok(fields);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAdmin(int id)
        {

            var admin = await doctorRepository.GetDoctorById(id);

            if (admin == null) return NotFound();

            else
            {
                doctorRepository.delete(admin);
                await doctorRepository.SaveAllAsync();
                return Ok();
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DoctorMemberDTO>>> GetDoctors()
        {
            var doctors = await doctorRepository.GetDoctorsmemAsync();
            return Ok(doctors);

        }
            [HttpPut("updatedoctorschedule/{doctorId}")]
            public async Task<ActionResult> UpdateDoctorSchedule(int doctorId, updatescheduleDTO scheduleDto)
            {
                var doctor = await context.Doctors.FindAsync(doctorId);
                if (doctor == null)
                return NotFound("Doctor not found");

                // Remove old schedule entries
                var oldSchedules = await context.Schedules
                    .Where(s => s.DoctorId == doctorId)
                    .ToListAsync();

                context.Schedules.RemoveRange(oldSchedules);

                // Parse time safely
                if (!TimeSpan.TryParse(scheduleDto.StartTime, out var startTime) ||
                    !TimeSpan.TryParse(scheduleDto.EndTime, out var endTime))
                {
                    return BadRequest("Invalid time format.");
                }

                // Add new schedule entries
                foreach (var day in scheduleDto.AvailableDays)
                {
                    context.Schedules.Add(new Schedule
                    {
                        DoctorId = doctorId,
                        DayOfWeek = (DayOfWeek)day,
                        StartTime = startTime,
                        EndTime = endTime
                    });
                }

                await context.SaveChangesAsync();
                return Ok();

            }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(DoctorMemberDTO doctorMemberDTO)
        {

            var editteddoctor = new DoctorMemberUpdateDTO();

            var doctor = await doctorRepository.GetDoctorById(doctorMemberDTO.id);
            if (doctor == null) return BadRequest("could not find doctor");

            using var hmac = new HMACSHA512();
            editteddoctor.id = doctorMemberDTO.id;
            editteddoctor.name = doctorMemberDTO.name;
            editteddoctor.DateOfBirth = doctorMemberDTO.DateOfBirth;
            editteddoctor.fieldId = doctorMemberDTO.fieldId;
            editteddoctor.adminId = doctorMemberDTO.adminId;

            if (!string.IsNullOrWhiteSpace(doctorMemberDTO.password))
            {
            editteddoctor.passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(doctorMemberDTO.password));
            editteddoctor.passwordSalt = hmac.Key;
            } 

            else
            {
            editteddoctor.passwordHash = doctor.PasswordHash;
            editteddoctor.passwordSalt = doctor.PasswordSalt;
            }
            
            editteddoctor.doctorprice = doctorMemberDTO.doctorPrice;
            mapper.Map(editteddoctor, doctor);
            var saveResult = await doctorRepository.SaveAllAsync();
            if (saveResult)
            {
                return NoContent();
            }
            else
            {
                Console.WriteLine("Save operation failed");
                return BadRequest("failed to update the doctor");
            }

        }

        [HttpPost("add-photo/{doctorId}")]

        public async Task<ActionResult> AddPhoto(IFormFile file, int doctorId)
        {

            var oldphoto = await context.Photos.FirstOrDefaultAsync(photo => photo.DoctorId == doctorId);

            if (oldphoto != null)
            {
                var resultofdeletioncloud = await photoService.DeletePhotoAsync(oldphoto.publicId);
                if (resultofdeletioncloud.Error != null) return BadRequest(resultofdeletioncloud.Error.Message);
                context.Photos.Remove(oldphoto);
                await doctorRepository.SaveAllAsync();
            }

            var resultupload = await photoService.AddPhotoAsync(file);
            if (resultupload.Error != null) return BadRequest(resultupload.Error.Message);

            var newPhoto = new Photos
            {
                Url = resultupload.SecureUrl.AbsoluteUri,
                publicId = resultupload.PublicId,
                DoctorId = doctorId
            };

            context.Photos.Add(newPhoto);
            await context.SaveChangesAsync();
            return Ok("New photo Added");
        }
    }

}