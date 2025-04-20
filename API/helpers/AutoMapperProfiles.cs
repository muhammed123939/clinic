using System;
using API.DTOS;
using API.entities;
using AutoMapper;

namespace API.helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<Store, StoreDTO>();
        CreateMap<StoreDTO, Store>();

        CreateMap<Products, ProductDTO>();
        CreateMap<ProductDTO, Products>();

        CreateMap<Groups, GroupDTO>();
        CreateMap<GroupDTO, Groups>();

        CreateMap<Orders, OrderDTO>();
        CreateMap<OrderDTO, Orders>();

        CreateMap<RegisterDTO, Admins>();

        CreateMap<AppointmentDTO, Appointments>();

        CreateMap<RegisterPatientDTO, Patients>();
        CreateMap<Patients, RegisterPatientDTO>();


        CreateMap<Patients, PatientDTO>();
        CreateMap<PatientDTO, Patients>();

        CreateMap<Patients, PatientMemberUpdateDTO>();
        CreateMap<PatientMemberUpdateDTO, Patients>();

        CreateMap<RegisterDoctorDTO, Doctors>();
        CreateMap<Doctors, RegisterDoctorDTO>();

        CreateMap<Admins, AdminMemberDTO>();

        CreateMap<AdminMemberUpdateDTO, Admins>();

        CreateMap<DoctorMemberUpdateDTO, Doctors>();

        CreateMap<Fields, FieldsDTO>();
        CreateMap<FieldsDTO, Fields>();

        CreateMap<Doctors, DoctorMemberDTO>();
        CreateMap<DoctorMemberDTO, Doctors>();
    }
}
