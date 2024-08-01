using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ie_coding_challenge_dgerber.Server.Models;

namespace ie_coding_challenge_dgerber.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InputDataController : ControllerBase
    {
        private readonly InputDataContext _context;

        public InputDataController(InputDataContext context)
        {
            _context = context;
        }

        // GET: api/InputData
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InputData>>> GetGivenInputs()
        {
            return await _context.GivenInputs.ToListAsync();
        }

        // GET: api/InputData/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InputData>> GetInputData(long id)
        {
            var inputData = await _context.GivenInputs.FindAsync(id);

            if (inputData == null)
            {
                return NotFound();
            }

            return inputData;
        }

        // PUT: api/InputData/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInputData(long id, InputData inputData)
        {
            if (id != inputData.Id)
            {
                return BadRequest();
            }

            _context.Entry(inputData).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InputDataExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/InputData
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<InputData>> PostInputData(InputData inputData)
        {
            _context.GivenInputs.Add(inputData);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInputData), new { id = inputData.Id }, inputData);
        }

        // DELETE: api/InputData/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInputData(long id)
        {
            var inputData = await _context.GivenInputs.FindAsync(id);
            if (inputData == null)
            {
                return NotFound();
            }

            _context.GivenInputs.Remove(inputData);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InputDataExists(long id)
        {
            return _context.GivenInputs.Any(e => e.Id == id);
        }
    }
}
