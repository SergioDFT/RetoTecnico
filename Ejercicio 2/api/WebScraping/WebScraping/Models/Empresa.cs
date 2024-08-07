using System;
using System.Collections.Generic;

namespace WebScraping.Models;

public partial class Empresa
{
    public int Id { get; set; }

    public string? RazonSocial { get; set; }

    public string? NombreComercial { get; set; }

    public string? IdentificacionTributaria { get; set; }

    public string? NumeroTelefonico { get; set; }

    public string? CorreoElectronico { get; set; }

    public string? SitioWeb { get; set; }

    public string? DireccionFisica { get; set; }

    public string? Pais { get; set; }

    public string? FacturacionAnual { get; set; }

    public DateTime? FechaUltimaEdicion { get; set; }
}
