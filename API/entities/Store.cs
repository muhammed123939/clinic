using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.entities;

public class Store
{
    public required int Id { get; set; }
    public required string Name { get; set; }
   public List <Admins>  Admins { get; set; }
   public Products Products { get; set; }

}
