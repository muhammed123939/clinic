using System;
using System.Data.Entity;
using API.DTOS;
using API.entities;
using API.interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace API.Data;

public class ProductRepository (DataContext context, IMapper mapper) : IProductRepository
{
    public void delete(Products Product)
    {
        context.Products.Remove(Product) ;
    }

    public async Task<Products?> GetProductById(int id)
    {
         return await context.Products.FindAsync(id);
    }

    public async Task<IEnumerable<ProductDTO>> GetProducts()
    {
        return await context.Products
        .ProjectTo<ProductDTO>(mapper.ConfigurationProvider)
        .ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
         return await context.SaveChangesAsync() > 0;
    }
}
