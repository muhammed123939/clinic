using API.Data;
using API.DTOS;
using API.entities;
using API.interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class StoreController(DataContext context, IStoreRepository StoreRepository, IMapper mapper) : BaseApiController
    {
        [HttpGet("{id}")]
        public async Task<ActionResult<StoreDTO>> getstore(int id)
        {
            var store = await StoreRepository.GetStoreById(id);

            if (store != null)
            {
                return Ok(store);
            }

            else
            {
                return BadRequest("cannot find store");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteStore(int id)
        {
         
            var store = await StoreRepository.GetStoreById(id);
            if (store == null) return NotFound();

            else
            {
                StoreRepository.delete(store);
                await StoreRepository.SaveAllAsync();
                return Ok();
            }
        }

        [HttpGet]
        public ActionResult<IEnumerable<StoreDTO>> GetStores()
        {
            return  context.Stores
                .ProjectTo<StoreDTO>(mapper.ConfigurationProvider)
                .ToList();
        }

        [HttpPost] 
        public async Task<ActionResult> AddStore(StoreDTO StoreDTO)
        {
            var newStore = mapper.Map<Store>(StoreDTO);
            newStore.Name = StoreDTO.Name;
            context.Stores.Add(newStore);
            await context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut]
        public async Task<ActionResult> UpdateStore(StoreDTO StoreDTO)
        {

            var Store = await StoreRepository.GetStoreById(StoreDTO.Id);
            if (Store == null) return BadRequest("could not find Store");

            mapper.Map(StoreDTO, Store);

            if (await StoreRepository.SaveAllAsync()) return NoContent();
            return BadRequest("failed to update the store");
        }
    }
}

