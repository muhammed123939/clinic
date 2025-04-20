using System;
using API.DTOS;
using API.entities;

namespace API.interfaces;

public interface IAppointmentRepository
{
     void delete (Appointments appointment);
    Task<Appointments?> GetAppointmentsById(int id);
    Task<bool> SaveAllAsync();

}
