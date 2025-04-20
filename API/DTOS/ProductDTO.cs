using System;

namespace API.DTOS;

public class ProductDTO
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required float Price { get; set; }
    public required int StoreId { get; set; }
    public required int Quantity { get; set; }
    public required int GroupId { get; set; }
}
