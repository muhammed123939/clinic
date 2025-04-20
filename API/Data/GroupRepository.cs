using System;
using System.Data.Entity;
using API.DTOS;
using API.entities;
using API.interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace API.Data;

public class GroupRepository (DataContext context, IMapper mapper) : IGroupRepository
{
    public void delete(Groups Group)
    {
        context.Groups.Remove(Group) ;
    }

    public async Task<Groups?> GetGroupById(int id)
    {
         return await context.Groups.FindAsync(id);
    }

    public async  Task<IEnumerable<GroupDTO>> GetGroups()
    {
        return await context.Groups
        .ProjectTo<GroupDTO>(mapper.ConfigurationProvider)
        .ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
         return await context.SaveChangesAsync() > 0;
    }
}
