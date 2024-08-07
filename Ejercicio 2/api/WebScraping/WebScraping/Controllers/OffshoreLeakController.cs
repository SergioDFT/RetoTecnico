using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using WebScraping.Models;
using Microsoft.EntityFrameworkCore;

namespace WebScraping.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OffshoreLeakController : ControllerBase
    {
        private readonly WebscrapingDbContext dbContext;

        public OffshoreLeakController(WebscrapingDbContext _dbContext)
        {
            dbContext = _dbContext;
        }

        public class OffshoreLeakResponse
        {
            public int hits { get; set; }
            public List<OffshoreLeak> data { get; set; }
        }

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetAll()
        {
            string query = @"SELECT TOP (1000) [Nombre], [Pais], [Relacionado], [Fuente]
                        FROM [dbo].[OffshoreLeaks]";

            var listaOffshoreLeak = await dbContext.OffshoreLeaks
                                                     .FromSqlRaw(query)
                                                     .ToListAsync();
            var response = new OffshoreLeakResponse
            {
                hits = listaOffshoreLeak.Count,
                data = listaOffshoreLeak
            };

            return StatusCode(StatusCodes.Status200OK, response);
        }

        [HttpGet]
        [Route("{searchString}")]
        public async Task<IActionResult> GetName(string searchString)
        {
            string query = $@"SELECT TOP (1000) [Nombre], [Pais], [Relacionado], [Fuente]
                        FROM [dbo].[OffshoreLeaks]
                        WHERE UPPER([dbo].[OffshoreLeaks].[Nombre]) LIKE UPPER('%{searchString}%')";

            var listaOffshoreLeak = await dbContext.OffshoreLeaks
                                                     .FromSqlRaw(query)
                                                     .ToListAsync();
            if (listaOffshoreLeak.Count == 0)
            {
                var response = new OffshoreLeakResponse
                {
                    hits = 0,
                    data = null
                };

                return StatusCode(StatusCodes.Status404NotFound, response);
            }
            else
            {
                var response = new OffshoreLeakResponse
                {
                    hits = listaOffshoreLeak.Count,
                    data = listaOffshoreLeak
                };

                return StatusCode(StatusCodes.Status200OK, response);
            }
        }

    }
}
