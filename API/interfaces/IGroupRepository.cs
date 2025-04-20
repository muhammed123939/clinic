using System;
using System.Text.RegularExpressions;
using API.DTOS;
using API.entities;

namespace API.interfaces;

public interface IGroupRepository
{
   void delete (Groups Group);
    Task<Groups?> GetGroupById(int id);
    Task<bool> SaveAllAsync();
    Task<IEnumerable<GroupDTO>> GetGroups();
}
