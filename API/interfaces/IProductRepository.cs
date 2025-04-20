using System;
using API.DTOS;
using API.entities;

namespace API.interfaces;

public interface IProductRepository
{
    void delete (Products Product);
    Task<Products?> GetProductById(int id);
    Task<bool> SaveAllAsync();
    Task<IEnumerable<ProductDTO>> GetProducts();
}
