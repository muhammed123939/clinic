using System;
using API.DTOS;
using API.entities;

namespace API.interfaces;

public interface IDoctorRepository
{
    void delete (Doctors doctor);
    Task<Doctors?> GetDoctorById(int id);
    Task<Fields?> getfieldbyid(int id);
    Task<bool> SaveAllAsync();
    Task<IEnumerable<DoctorMemberDTO>> GetDoctorsmemAsync();
    Task<IEnumerable<FieldsDTO>> GetFields();
}
