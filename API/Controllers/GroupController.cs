using System.Data.Entity;
using API.Data;
using API.DTOS;
using API.entities;
using API.interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class GroupController(DataContext context, IGroupRepository GroupRepository, IMapper mapper) : BaseApiController
    {
        [HttpGet("{id}")]
        public async Task<ActionResult<GroupDTO>> getgroup(int id)
        {
            var group = await GroupRepository.GetGroupById(id);

            if (group != null)
            {
                return Ok(group);
            }

            else
            {
                return BadRequest("cannot find group");
            }
        
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteGroup(int id)
        {

            var group = await GroupRepository.GetGroupById(id);
            if (group == null) return NotFound();

            else
            {
                GroupRepository.delete(group);
                await GroupRepository.SaveAllAsync();
                return Ok();
            }
        }

        [HttpGet]
        public ActionResult<IEnumerable<GroupDTO>> GetGroups()
        {
            return  context.Groups
                .ProjectTo<GroupDTO>(mapper.ConfigurationProvider)
                .ToList();
        }

        [HttpPost]
       public async Task<ActionResult> AddGroup(GroupDTO GroupDTO)
        {
            var newGroup = mapper.Map<Groups>(GroupDTO);
            newGroup.Name = GroupDTO.Name;
            context.Groups.Add(newGroup);
            await context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut]
        public async Task<ActionResult> UpdateGroup(GroupDTO groupDTO)
        {

            var group = await GroupRepository.GetGroupById(groupDTO.Id);
            if (group == null) return BadRequest("could not find group");

            mapper.Map(groupDTO, group);

            if (await GroupRepository.SaveAllAsync()) return NoContent();
            return BadRequest("failed to update the group");
        }
    }
}
