using System;
using API.DTOS;
using API.entities;
using API.interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DoctorRepository (DataContext context, IMapper mapper) : IDoctorRepository
{
        public async Task<IEnumerable<FieldsDTO>> GetFields()
    {
           return await context.Fields
        .ProjectTo<FieldsDTO>(mapper.ConfigurationProvider)
        .ToListAsync();

    }
    
    public void delete(Doctors doctor)
    {
        context.Doctors.Remove(doctor) ;
    }

    public async Task<Fields?> getfieldbyid(int id)
    {
         return await context.Fields.FindAsync(id);
    }

    public async Task<Doctors?> GetDoctorById(int id)
    {
         return await context.Doctors.FindAsync(id);
    }

    public async Task<IEnumerable<DoctorMemberDTO>> GetDoctorsmemAsync()
    {
        
        return await context.Doctors
        .ProjectTo<DoctorMemberDTO>(mapper.ConfigurationProvider)
        .ToListAsync();
    }

   public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

}
