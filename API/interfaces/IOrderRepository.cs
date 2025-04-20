using System;
using API.DTOS;
using API.entities;

namespace API.interfaces;

public interface IOrderRepository
{
   void delete (Orders order);
    Task<Orders?> GetOrderById(int id);
    Task<bool> SaveAllAsync();
    Task<IEnumerable<OrderDTO>> GetOrders();
}
