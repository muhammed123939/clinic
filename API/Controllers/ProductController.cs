using API.Data;
using API.DTOS;
using API.entities;
using API.interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductController (DataContext context, IProductRepository ProductRepository, IMapper mapper) : BaseApiController
    {

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> getproduct(int id)
        {
            var product = await ProductRepository.GetProductById(id);

            if (product != null)
            {
                return Ok(product);
            }

            else
            {
                return BadRequest("cannot find product");
            }
        }
        [HttpGet("stores")]
        public async Task<ActionResult<IEnumerable<StoreDTO>>>getstores()
        {
            var stores = context.Stores.FromSqlInterpolated
            ($"SELECT s.Id, s.Name FROM Stores s join Products p on p.StoreId = s.Id GROUP BY p.Id").ToList(); ;

            return Ok(stores);

        }   
        
         [HttpGet("groups")]
        public async Task<ActionResult<IEnumerable<GroupDTO>>>getgroups()
        {
            var groups = context.Groups.FromSqlInterpolated
            ($"SELECT g.Id, g.Name FROM Groups g join Products p on p.StoreId = g.Id GROUP BY p.Id").ToList(); ;
            return Ok(groups);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
         
            var product = await ProductRepository.GetProductById(id);
            if (product == null) return NotFound();

            else
            {
                ProductRepository.delete(product);
                await ProductRepository.SaveAllAsync();
                return Ok();
            }
        }

        [HttpGet]
        public ActionResult<IEnumerable<ProductDTO>> GetProducts()
        {
            return  context.Products
                .ProjectTo<ProductDTO>(mapper.ConfigurationProvider)
                .ToList();
        }


        [HttpPost] 
        public async Task<ActionResult> AddProduct(ProductDTO productDTO)
        {
            var newproduct = mapper.Map<Products>(productDTO);
            newproduct.Name = productDTO.Name;
            newproduct.Price = productDTO.Price;
            newproduct.StoreId = productDTO.StoreId;
            newproduct.Quantity = productDTO.Quantity;
            newproduct.GroupId = productDTO.GroupId;
         
            context.Products.Add(newproduct);
            await context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut]
        public async Task<ActionResult> UpdateProduct(ProductDTO productDTO)
        {

            var product = await ProductRepository.GetProductById(productDTO.Id);
            if (product == null) return BadRequest("could not find product");

            mapper.Map(productDTO, product);

            if (await ProductRepository.SaveAllAsync()) return NoContent();
            return BadRequest("failed to update the product");
        }

    }
}
