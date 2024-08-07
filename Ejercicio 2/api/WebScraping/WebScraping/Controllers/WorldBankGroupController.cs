using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using WebScraping.Models;
using Microsoft.EntityFrameworkCore;

namespace WebScraping.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorldBankGroupController : ControllerBase
    {
        private readonly WebscrapingDbContext dbContext;

        public WorldBankGroupController(WebscrapingDbContext _dbContext)
        {
            dbContext = _dbContext;
        }

        public class WorldBankGroupResponse
        {
            public int hits { get; set; }
            public List<WorldBankGroup> data { get; set; }
        }

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetAll()
        {
            string query = @"SELECT TOP (1000) [Nombre], [Pais], [Desde], [Hasta], [Motivo]
                         FROM [dbo].[WorldBankGroup]";

            var listaWorldBankGroup = await dbContext.WorldBankGroups
                                                     .FromSqlRaw(query)
                                                     .ToListAsync();
            var response = new WorldBankGroupResponse
            {
                hits = listaWorldBankGroup.Count,
                data = listaWorldBankGroup
            };

            return StatusCode(StatusCodes.Status200OK, response);
        }

        [HttpGet]
        [Route("{searchString}")]
        public async Task<IActionResult> GetName(string searchString)
        {
            string query = $@"SELECT TOP (1000) [Nombre], [Pais], [Desde], [Hasta], [Motivo]
                        FROM [dbo].[WorldBankGroup]
                        WHERE UPPER([dbo].[WorldBankGroup].[Nombre]) LIKE UPPER('%{searchString}%')";

            var listaWorldBankGroup = await dbContext.WorldBankGroups
                                                    .FromSqlRaw(query)
                                                    .ToListAsync();
            if (listaWorldBankGroup.Count == 0)
            {
                var response = new WorldBankGroupResponse
                {
                    hits = 0,
                    data = null
                };

                return StatusCode(StatusCodes.Status404NotFound, response);
            }
            else
            {
                var response = new WorldBankGroupResponse
                {
                    hits = listaWorldBankGroup.Count,
                    data = listaWorldBankGroup
                };

                return StatusCode(StatusCodes.Status200OK, response);

            }
        }
    }
}
