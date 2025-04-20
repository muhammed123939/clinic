using System;
using System.Data.Entity;
using API.DTOS;
using API.entities;
using API.interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace API.Data;

public class OrderRepository (DataContext context, IMapper mapper): IOrderRepository
{
    public void delete(Orders order)
    {
        context.Orders.Remove(order) ;
    }

    public async Task<Orders?> GetOrderById(int id)
    {
         return await context.Orders.FindAsync(id);
    }

    public async Task<IEnumerable<OrderDTO>> GetOrders()
    {
        return await context.Orders
        .ProjectTo<OrderDTO>(mapper.ConfigurationProvider)
        .ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
         return await context.SaveChangesAsync() > 0;
    }
}
