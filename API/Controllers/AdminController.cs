using System.Security.Cryptography;
using System.Text;
using API.DTOS;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AdminController(IAdminRepository adminRepository, IMapper mapper) : BaseApiController
    {

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAdmin(int id)
        {

            var admin = await adminRepository.GetAdminById(id);

            if (admin == null) return NotFound();

            else
            {
                adminRepository.delete(admin);
                await adminRepository.SaveAllAsync();
                return Ok();
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdminMemberDTO>>> GetUsers()
        {
            var admins = await adminRepository.GetAdminsmemAsync();
            return Ok(admins);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AdminMemberDTO>> Getuserbyid(int id)
        {
            var admin = await adminRepository.GetAdminById(id);
            if (admin != null)
            {
                return Ok(admin);
            }
            else
            {
                return BadRequest("cannot find admin");
            }
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(AdminMemberDTO adminmemberDTO)
        {
            var edittedadmin = new AdminMemberUpdateDTO();
            var admin = await adminRepository.GetAdminById(adminmemberDTO.id);
            if (admin == null) return BadRequest("could not find admin");

            using var hmac = new HMACSHA512();
            edittedadmin.id = adminmemberDTO.id;
            edittedadmin.canDo = adminmemberDTO.canDo;
            edittedadmin.name = adminmemberDTO.name;
            
            if (!string.IsNullOrWhiteSpace(adminmemberDTO.password))
            {
            edittedadmin.passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(adminmemberDTO.password));
            edittedadmin.passwordSalt = hmac.Key;
            } 

            else
            {
            edittedadmin.passwordHash = admin.PasswordHash;
            edittedadmin.passwordSalt = admin.PasswordSalt;
            }
            edittedadmin.storeId = adminmemberDTO.storeId;

            mapper.Map(edittedadmin, admin);
            if (await adminRepository.SaveAllAsync()) return NoContent();
            return BadRequest("failed to update the admin");
        }

    }
}
