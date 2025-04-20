using System;

namespace API.entities;

public class Groups
{

    public required int Id { get; set; }
    public required string Name { get; set; }
   public List<Products> Products { get; set; }

}
