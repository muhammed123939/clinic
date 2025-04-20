using System;
using API.DTOS;
using API.entities;

namespace API.interfaces;

public interface IStoreRepository
{
    void delete (Store store);
    Task<Store?> GetStoreById(int id);
    Task<bool> SaveAllAsync();
    Task<IEnumerable<StoreDTO>> GetStores();

}
