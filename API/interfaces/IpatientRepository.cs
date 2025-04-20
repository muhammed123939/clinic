using System;
using API.DTOS;
using API.entities;

namespace API.interfaces;

public interface IpatientRepository
{
    void delete (Patients patient);
    Task<Patients?> GetPatientById(int id);
    Task<bool> SaveAllAsync();
    // Task<IEnumerable<PatientDTO>> GetpatientsAsync();
}
