using System;
using System.Data.Entity;
using API.DTOS;
using API.entities;
using API.interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace API.Data;

public class StoreRepository(DataContext context, IMapper mapper) : IStoreRepository
{
    public void delete(Store store)
    {
        context.Stores.Remove(store) ;
    }

    public async Task<Store?> GetStoreById(int id)
    {
         return await context.Stores.FindAsync(id);
    }

    public async Task<IEnumerable<StoreDTO>> GetStores()
    {
        return await context.Stores
        .ProjectTo<StoreDTO>(mapper.ConfigurationProvider)
        .ToListAsync();
    }
    public async Task<bool> SaveAllAsync()
    {
         return await context.SaveChangesAsync() > 0;
    }
}
