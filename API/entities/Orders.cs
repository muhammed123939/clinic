using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.entities;

public class Orders
{
    public required int Id { get; set; }
    public required string Type { get; set; }

    [ForeignKey("Products")]
    public int ProductId { get; set; }

    [ForeignKey("Admins")]
    public int AdminId { get; set; }
    public required int Quantity { get; set; }
    public Products Products { get; set; }
    public Admins Admins { get; set; }

}
