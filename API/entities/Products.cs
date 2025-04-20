using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.entities;

public class Products
{

    public required int Id { get; set; }

    public required string Name { get; set; }
    public required float Price { get; set; }
    public required int Quantity { get; set; }


    [ForeignKey("Store")]
    public int  StoreId { get; set; }

  [ForeignKey("Groups")]
    public int GroupId { get; set; }
    public List<Orders> orders { get; set; }   
   public Store store { get; set; }
   public Groups Groups { get; set; }

}
