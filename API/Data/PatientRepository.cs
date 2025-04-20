using System;
using System.Data.Entity;
using API.DTOS;
using API.entities;
using API.interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace API.Data;

public class PatientRepository (DataContext context, IMapper mapper) : IpatientRepository
{
    public void delete(Patients patient)
    {
        context.Patients.Remove(patient) ;
    }

    // public async Task<IEnumerable<PatientDTO>> GetpatientsAsync()
    // {
        
    //     return await context.Patients
    //     .ProjectTo<PatientDTO>(mapper.ConfigurationProvider)
    //     .ToListAsync();
    // }

    public async Task<Patients?> GetPatientById(int id)
    {
          return await context.Patients.FindAsync(id);
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
