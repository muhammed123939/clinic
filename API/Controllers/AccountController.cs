using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOS;
using API.entities;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController (IDoctorRepository doctorRepository , DataContext context , ItokenService tokenService, IMapper mapper): BaseApiController
    {

    [HttpGet("fields")] //acount/register    
     public async Task<ActionResult<IEnumerable<FieldsDTO>>> Getfields()
     {
       var Fields = await doctorRepository.GetFields();
       return Ok(Fields);
    }

    [HttpPost("register")] //acount/register     
    public async Task<ActionResult<AdminDTO>> Register(RegisterDTO registerDTo)
    {
        if (await UserExists(registerDTo.adminname)) return BadRequest("username is taken");
        using var hmac = new HMACSHA512();
        var newadmin = mapper.Map<Admins>(registerDTo);
        newadmin.Name = registerDTo.adminname;
        newadmin.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTo.adminpassword));
        newadmin.PasswordSalt = hmac.Key;
        newadmin.CanDo=registerDTo.cando;
       
        context.Admin.Add(newadmin);
        await context.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("registerpatient")] //acount/register     
    public async Task<ActionResult> Registerpatient(RegisterPatientDTO registerDTo)
    {
        if (await MobileExists(registerDTo.mobile)) return BadRequest("mobile number taken");
        if (await nationanumExists(registerDTo.nationalNumber)) return BadRequest("national number taken");

        var newpatient = mapper.Map<Patients>(registerDTo);
        using var hmac = new HMACSHA512();
        
        newpatient.Name = registerDTo.name;
        newpatient.Gender = registerDTo.gender;
        newpatient.MobileNumber = registerDTo.mobile;
        newpatient.DateOfBirth = registerDTo.DateOfBirth;
        newpatient.NationalNumber = registerDTo.nationalNumber;
        newpatient.AdminId = registerDTo.adminId;
      
        newpatient.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("123456"));
        newpatient.PasswordSalt = hmac.Key;
        
        context.Patients.Add(newpatient);
        await context.SaveChangesAsync();
        return Ok();
        
    }

    [HttpPost("registerdoctor")] //acount/register     
    public async Task<ActionResult> Registerdoctor(RegisterDoctorDTO registerDTo)
    {

         if (await DoctorExists(registerDTo.doctorname)) return BadRequest("doctor name is taken");

        var existingadmin =  context.Admin.Find(registerDTo.adminId);
        var existingfield =  context.Fields.Find(registerDTo.fieldId);
        if (existingadmin==null||existingfield==null)return NotFound("admin or field not found");
        
        using var hmac = new HMACSHA512();
        var newdoctor = mapper.Map<Doctors>(registerDTo);
        
        newdoctor.Name = registerDTo.doctorname;
        newdoctor.DateOfBirth = registerDTo.DateOfBirth;
        newdoctor.FieldId = registerDTo.fieldId;
        newdoctor.AdminId = registerDTo.adminId;
        newdoctor.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTo.doctorpassword));
        newdoctor.PasswordSalt = hmac.Key;
        newdoctor.DoctorPrice=registerDTo.doctorprice;
        
        context.Doctors.Add(newdoctor);
        await context.SaveChangesAsync();
            // Insert into Schedule table
    if (registerDTo.AvailableDays != null && registerDTo.AvailableDays.Any())
    {
        
        foreach (var day in registerDTo.AvailableDays)
        {
            var schedule = new Schedule
            {
                DoctorId = newdoctor.Id,
                DayOfWeek = (DayOfWeek)day,
                StartTime = TimeSpan.Parse(registerDTo.StartTime),
                EndTime = TimeSpan.Parse(registerDTo.EndTime)
            };
            context.Schedules.Add(schedule);
        }

        await context.SaveChangesAsync(); // Save all schedules
    }
        return Ok();
    }

    [HttpPost("loginpatient")] //function 3mlt check login w b3tt check for login 
    public async Task<ActionResult<PatientloginDTO>> Loginpatient(LoginDTO loginDTo)
    {
        var patient = await context.Patients
        .FirstOrDefaultAsync(x => x.Name.ToLower() == loginDTo.Name.ToLower());
        if (patient == null) return Unauthorized("invalid patient name");
        using var hmac = new HMACSHA512(patient.PasswordSalt);
        var computedhash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTo.Password));
        for (int i = 0; i < computedhash.Length; i++)
        {
            if (computedhash[i] != patient.PasswordHash[i]) return Unauthorized("invalid password !");
        }
        return new PatientloginDTO
        {
            Id = patient.Id , 
            name = patient.Name ,
            Token = tokenService.CreateTokenPatient(patient) 
        };
    }
    

    [HttpPost("logindoctor")] //function 3mlt check login w b3tt check for login 
    public async Task<ActionResult<DoctorDTO>> Logindoctor(LoginDTO loginDTo)
    {
        var doctor = await context.Doctors
        .FirstOrDefaultAsync(x => x.Name.ToLower() == loginDTo.Name.ToLower());
        if (doctor == null) return Unauthorized("invalid Doctorname");
        using var hmac = new HMACSHA512(doctor.PasswordSalt);
        var computedhash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTo.Password));
        for (int i = 0; i < computedhash.Length; i++)
        {
            if (computedhash[i] != doctor.PasswordHash[i]) return Unauthorized("invalid password !");
        }
        return new DoctorDTO
        {
            Id = doctor.Id , 
            Doctorname = doctor.Name ,
            Token = tokenService.CreateTokenDoctor(doctor) 
        };
    }
    

    [HttpPost("login")] //function 3mlt check login w b3tt check for login 
    public async Task<ActionResult<AdminDTO>> Login(LoginDTO loginDTo)
    {
        var admin = await context.Admin
        .FirstOrDefaultAsync(x => x.Name.ToLower() == loginDTo.Name.ToLower());//get first username exist
        if (admin == null) return Unauthorized("invalid username");
        using var hmac = new HMACSHA512(admin.PasswordSalt);//5at salt mn database
        var computedhash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTo.Password));//compute hash elsalt m3 elpassword entered
        for (int i = 0; i < computedhash.Length; i++)
        {
            if (computedhash[i] != admin.PasswordHash[i]) return Unauthorized("invalid password !");//karen password hash in db m3 computed hash
        }
        return new AdminDTO
        {
            Id = admin.Id , 
            Cando = admin.CanDo ,
            Username = admin.Name,
            Token = tokenService.CreateToken(admin),
            Store_Id = admin.storeId 
        };
    }

    private async Task<bool> MobileExists(string mobile)
    {
        return await context.Patients.AnyAsync(x => x.MobileNumber == mobile);
    }     
    
    private async Task<bool> nationanumExists(string nationalnumber)
    {
        return await context.Patients.AnyAsync(x => x.NationalNumber ==nationalnumber);
    }     

    private async Task<bool> DoctorExists(string username)
    {
        return await context.Doctors.AnyAsync(x => x.Name.ToLower() == username.ToLower()); //check 3la kol el users
    }     
    private async Task<bool> UserExists(string username)
    {
        return await context.Admin.AnyAsync(x => x.Name.ToLower() == username.ToLower()); //check 3la kol el users
    }
    
    }
}
