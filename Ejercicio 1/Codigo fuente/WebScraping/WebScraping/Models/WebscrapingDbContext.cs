using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace WebScraping.Models;

public partial class WebscrapingDbContext : DbContext
{
    public WebscrapingDbContext()
    {
    }

    public WebscrapingDbContext(DbContextOptions<WebscrapingDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<OfacSdn> OfacSdns { get; set; }

    public virtual DbSet<OffshoreLeak> OffshoreLeaks { get; set; }

    public virtual DbSet<WorldBankGroup> WorldBankGroups { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OfacSdn>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("OfacSdn");

            entity.Property(e => e.Comentario).HasMaxLength(255);
            entity.Property(e => e.Nombre).HasMaxLength(255);
            entity.Property(e => e.Programa).HasMaxLength(255);
            entity.Property(e => e.Tipo).HasMaxLength(255);
        });

        modelBuilder.Entity<OffshoreLeak>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.Fuente)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Nombre)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Pais)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Relacionado)
                .HasMaxLength(150)
                .IsUnicode(false);
        });

        modelBuilder.Entity<WorldBankGroup>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("WorldBankGroup");

            entity.Property(e => e.Desde).HasMaxLength(255);
            entity.Property(e => e.Hasta).HasMaxLength(255);
            entity.Property(e => e.Motivo).HasMaxLength(255);
            entity.Property(e => e.Nombre).HasMaxLength(255);
            entity.Property(e => e.Pais).HasMaxLength(255);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
