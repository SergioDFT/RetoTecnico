using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using WebScraping.Models;
using Microsoft.EntityFrameworkCore;

namespace WebScraping.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpresaController : ControllerBase
    {
        private readonly WebscrapingDbContext dbContext;

        public EmpresaController(WebscrapingDbContext _dbContext)
        {
            dbContext = _dbContext;
        }

        public class EmpresaResponse
        {
            public int hits { get; set; }
            public List<Empresa> data { get; set; }
        }

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetAll()
        {
            string query = @"SELECT TOP (1000) [Id],[RazonSocial],[NombreComercial],[IdentificacionTributaria],[NumeroTelefonico],[CorreoElectronico],[SitioWeb],[DireccionFisica],[Pais],[FacturacionAnual],[FechaUltimaEdicion]
                            FROM [dbo].[Empresa] ORDER BY [FechaUltimaEdicion] DESC";

            var listaEmpresa = await dbContext.Empresas
                                                     .FromSqlRaw(query)
                                                     .ToListAsync();
            var response = new EmpresaResponse
            {
                hits = listaEmpresa.Count,
                data = listaEmpresa
            };

            return StatusCode(StatusCodes.Status200OK, response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetId(int id)
        {
            var empleado = await dbContext.Empresas.FirstOrDefaultAsync(e=>e.Id == id);

            return StatusCode(StatusCodes.Status200OK, empleado);
        }

        [HttpPost]
        [Route("NuevaEmpresa")]
        public async Task<IActionResult> NuevaEmpresa([FromBody] Empresa objeto)
        {
            await dbContext.Empresas.AddAsync(objeto);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new {mensaje="ok"});
        }

        [HttpPut]
        [Route("EditarEmpresa")]
        public async Task<IActionResult> EditarEmpresa([FromBody] Empresa objeto)
        {
            dbContext.Empresas.Update(objeto);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok" });
        }

        [HttpDelete]
        [Route("EliminarEmpleado/{id:int}")]
        public async Task<IActionResult> EliminarId(int id)
        {
            var empleado = await dbContext.Empresas.FirstOrDefaultAsync(e => e.Id == id);
            dbContext.Empresas.Remove(empleado);
            await dbContext.SaveChangesAsync();
            return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok" });
        }

    }
}
