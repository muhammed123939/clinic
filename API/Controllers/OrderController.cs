using System.Diagnostics;
using API.Data;
using API.DTOS;
using API.entities;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class OrderController(DataContext context, IOrderRepository OrderRepository,
    IProductRepository ProductRepository, IMapper mapper) : BaseApiController
    {
        [HttpGet("getproduct/{id}")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProducts(int id)
        {
            var products = await context.Products
            .FromSqlInterpolated($"SELECT * FROM Products WHERE StoreId ={id}")
            .Select(a => new ProductDTO
            {
                Id = a.Id,
                Name = a.Name,
                Price = a.Price,
                GroupId = a.GroupId,
                StoreId = a.StoreId,
                Quantity = a.Quantity
            })
            .ToListAsync();

            return Ok(products);
        }

        [HttpGet("getorder/{id}")]
        public async Task<ActionResult<OrderDTO>> getorder(int id)
        {
            var order = await OrderRepository.GetOrderById(id);

            if (order != null)
            {
                return Ok(order);
            }

            else
            {
                return BadRequest("cannot find order");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteOrder(int id)
        {

            var order = await OrderRepository.GetOrderById(id);
            if (order == null) return NotFound();

            else
            {

                var product = await ProductRepository.GetProductById(order.ProductId);

                if (order.Type == "IN")
                {
                    var newproduct = new ProductDTO
                    {
                        Id = product.Id,
                        Name = product.Name,
                        Price = product.Price,
                        Quantity = product.Quantity-order.Quantity,
                        StoreId = product.StoreId,
                        GroupId = product.GroupId
                    };

                    mapper.Map(newproduct, product);
                    await OrderRepository.SaveAllAsync();
                }

                if (order.Type == "OUT")
                {
                    var newproduct = new ProductDTO
                    {
                        Id = product.Id,
                        Name = product.Name,
                        Price = product.Price,
                        Quantity = product.Quantity + order.Quantity,
                        StoreId = product.StoreId,
                        GroupId = product.GroupId
                    };

                    mapper.Map(newproduct, product);
                    await OrderRepository.SaveAllAsync();

                }

                OrderRepository.delete(order);
                await OrderRepository.SaveAllAsync();
                return Ok();

            }
        }

        [HttpGet("allorders")]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetOrders()
        {
            var orders = await context.Orders
                .Select(a => new OrderDTO
                {
                    Id = a.Id,
                    ProductId = a.ProductId,
                    AdminId = a.AdminId,
                    Quantity = a.Quantity,
                    Type = a.Type,
                })
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("someorders/{id}")]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetSomeOrders(int id)
        {
            var orders = await context.Orders
            .FromSqlInterpolated($"SELECT * FROM Orders WHERE AdminId ={id}")
            .Select(a => new OrderDTO
            {
                Id = a.Id,
                ProductId = a.ProductId,
                AdminId = a.AdminId,
                Quantity = a.Quantity,
                Type = a.Type,

            })
            .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("authorder/{id}/{id2}")]
        public async Task<ActionResult<bool>> CheckOrder(int id, int id2)
        {
            var exists = await context.Orders
                .AnyAsync(o => o.Id == id && o.AdminId == id2);

            return Ok(exists);
        }

        [HttpPost]
        public async Task<ActionResult> AddOrder(OrderDTO orderDTO)
        {
            if (await QuantityAvability(orderDTO.Quantity, orderDTO.ProductId, orderDTO.Type) == false) return BadRequest("quantity is not available");

            var newOrder = mapper.Map<Orders>(orderDTO);
            newOrder.ProductId = orderDTO.ProductId;
            newOrder.AdminId = orderDTO.AdminId;
            newOrder.Quantity = orderDTO.Quantity;
            newOrder.Type = orderDTO.Type;
            context.Orders.Add(newOrder);
            await context.SaveChangesAsync();
            return Ok();

        }

        private async Task<bool> QuantityAvability(int Quantityorder, int product_id, string type)
        {
            var quantity = await context.Products
                .Where(p => p.Id == product_id)
                .Select(p => p.Quantity)
                .FirstOrDefaultAsync();

            if (type == "IN")
            {

                var product = await ProductRepository.GetProductById(product_id);

                var newproduct = new ProductDTO
                {
                    Id = product.Id,
                    Name = product.Name,
                    Price = product.Price,
                    Quantity = product.Quantity + Quantityorder,
                    StoreId = product.StoreId,
                    GroupId = product.GroupId
                };

                mapper.Map(newproduct, product);
                await OrderRepository.SaveAllAsync();
                return true;
            }

            else
            {
                if (quantity < Quantityorder)
                {
                    return false;
                }

                var product = await ProductRepository.GetProductById(product_id);

                var newproduct = new ProductDTO
                {
                    Id = product.Id,
                    Name = product.Name,
                    Price = product.Price,
                    Quantity = product.Quantity - Quantityorder,
                    StoreId = product.StoreId,
                    GroupId = product.GroupId
                };

                mapper.Map(newproduct, product);
                await OrderRepository.SaveAllAsync();
                return true;

            }

        }

        [HttpPut]
        public async Task<ActionResult> UpdateOrder(OrderDTO orderDTO)
        {
            var order = await OrderRepository.GetOrderById(orderDTO.Id);
            if (order == null) return BadRequest("could not find order");
            mapper.Map(orderDTO, order);
            if (await OrderRepository.SaveAllAsync()) return NoContent();
            return BadRequest("failed to update the order");
        }

    }
}
