using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOS;
using API.interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class PatientController(IpatientRepository patientRepository,
    IMapper mapper, DataContext context) : BaseApiController
    {
        [HttpGet("appointmentsbypatient/{doctorId}")]
        public async Task<ActionResult<IEnumerable<AdminAddedDoctorDTO>>> appointmentsbypatient(int doctorId)
        {
            var patients = context.Patients.FromSqlInterpolated
            ($"SELECT p.Id, p.Name FROM Patients p JOIN Appointments a ON a.PatientId = p.Id WHERE a.DoctorId = {doctorId}").Select(e => new AdminAddedDoctorDTO
            {
                id = e.Id,
                name = e.Name
            }).ToList();

            return Ok(patients);
        }

        [HttpGet("adminaddedthepatient")]
        public async Task<ActionResult<IEnumerable<AdminAddedDoctorDTO>>> adminaddedthepatient()
        {
            var admins = context.Admin.FromSqlInterpolated
            ($"SELECT a.Id, a.Name FROM Admin a JOIN Patients p  ON p.AdminId = a.Id GROUP BY p.Id").Select(e => new AdminAddedDoctorDTO
            {
                id = e.Id,
                name = e.Name
            })
            .ToList();

            return Ok(admins);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(PatientDTO patientMemberDTO)
        {


            var patient = await patientRepository.GetPatientById(patientMemberDTO.id);
            if (patient == null) return BadRequest("could not find patient");
            var edittedpatient = new PatientMemberUpdateDTO();

            using var hmac = new HMACSHA512();
            edittedpatient.id = patientMemberDTO.id;
            edittedpatient.name = patientMemberDTO.name;
            edittedpatient.age = patientMemberDTO.age;
            edittedpatient.gender = patientMemberDTO.gender;
            edittedpatient.mobileNumber = patientMemberDTO.mobileNumber;
            edittedpatient.dateOfBirth = patientMemberDTO.dateOfBirth;
            edittedpatient.adminId = patientMemberDTO.adminId;
            edittedpatient.nationalNumber = patientMemberDTO.nationalNumber;

            if (!string.IsNullOrWhiteSpace(patientMemberDTO.password))
            {
            edittedpatient.passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(patientMemberDTO.password));
            edittedpatient.passwordSalt = hmac.Key;
            } 

            else
            {
            edittedpatient.passwordHash = patient.PasswordHash;
            edittedpatient.passwordSalt = patient.PasswordSalt;
            }
            

            mapper.Map(edittedpatient, patient);
            var saveResult = await patientRepository.SaveAllAsync();
            if (saveResult)
            {
                return NoContent();
            }
            else
            {
                Console.WriteLine("Save operation failed");
                return BadRequest("failed to update the patient");
            }

}

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientDTO>>> Getpatients()
        {
                return await context.Patients.ProjectTo<PatientDTO>(mapper.ConfigurationProvider).ToListAsync();        
        }
    
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<PatientDTO>>> SearchPatients([FromQuery] string term)
        {
            if (term == "all")
            {
                return await context.Patients
                    .ProjectTo<PatientDTO>(mapper.ConfigurationProvider)
                    .ToListAsync();
            }

            if (string.IsNullOrWhiteSpace(term) || term.Length == 1)
            {
                return Ok();
            }

            else
            {
                term = term.ToLower();
                return await context.Patients
                    .Where(p => p.NationalNumber.ToLower().Contains(term) || p.Name.ToLower().Contains(term) || p.MobileNumber.ToLower().Contains(term))
                    .ProjectTo<PatientDTO>(mapper.ConfigurationProvider)
                    .ToListAsync();
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PatientDTO>> Getpatientbyid(int id)
        {
            var patient = await patientRepository.GetPatientById(id);
            if (patient != null)
            {
                return Ok(patient);
            }
            else
            {
                return BadRequest("cannot find patient");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePatient(int id)
        {

            var admin = await patientRepository.GetPatientById(id);

            if (admin == null) return NotFound();

            else
            {
                patientRepository.delete(admin);
                await patientRepository.SaveAllAsync();
                return Ok();
            }
        }
    }
}
