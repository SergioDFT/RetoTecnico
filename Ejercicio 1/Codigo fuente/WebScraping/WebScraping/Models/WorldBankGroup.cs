using System;
using System.Collections.Generic;

namespace WebScraping.Models;

public partial class WorldBankGroup
{
    public string? Nombre { get; set; }

    public string? Pais { get; set; }

    public string? Desde { get; set; }

    public string? Hasta { get; set; }

    public string? Motivo { get; set; }
}
