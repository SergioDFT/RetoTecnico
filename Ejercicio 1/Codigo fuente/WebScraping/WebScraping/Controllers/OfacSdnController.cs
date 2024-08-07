using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using WebScraping.Models;
using Microsoft.EntityFrameworkCore;

namespace WebScraping.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OfacSdnController : ControllerBase
    {
        private readonly WebscrapingDbContext dbContext;

        public OfacSdnController(WebscrapingDbContext _dbContext)
        {
            dbContext = _dbContext;
        }

        public class OfacSdnpResponse
        {
            public int hits { get; set; }
            public List<OfacSdn> data { get; set; }
        }

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetAll()
        {
            string query = @"SELECT TOP (1000) [Nombre], [Tipo], [Programa], [Comentario]
                         FROM [dbo].[OfacSdn]";

            var listaOfacSdn = await dbContext.OfacSdns
                                                     .FromSqlRaw(query)
                                                     .ToListAsync();
            var response = new OfacSdnpResponse
            {
                hits = listaOfacSdn.Count,
                data = listaOfacSdn
            };

            return StatusCode(StatusCodes.Status200OK, response);
        }

        [HttpGet]
        [Route("{searchString}")]
        public async Task<IActionResult> GetName(string searchString)
        {
            string query = $@"SELECT TOP (1000) [Nombre], [Tipo], [Programa], [Comentario]
                        FROM [dbo].[OfacSdn]
                        WHERE UPPER([dbo].[OfacSdn].[Nombre]) LIKE UPPER('%{searchString}%')";

            var listaOfacSdn = await dbContext.OfacSdns
                                                    .FromSqlRaw(query)
                                                    .ToListAsync();
            if (listaOfacSdn.Count==0)
            {
                var response = new OfacSdnpResponse
                {
                    hits = 0,
                    data = null
                };
                return StatusCode(StatusCodes.Status404NotFound, response);
            }
            else
            {
                var response = new OfacSdnpResponse
                {
                    hits = listaOfacSdn.Count,
                    data = listaOfacSdn
                };
                return StatusCode(StatusCodes.Status200OK, response);
            }
            
        }

    }
}
