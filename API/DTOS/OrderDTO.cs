using System;

namespace API.DTOS;

public class OrderDTO
{
    public  int Id { get; set; }
    public required int ProductId { get; set; }
    public required int AdminId { get; set; }
    public required int Quantity { get; set; }
    public required string Type { get; set; }
}
