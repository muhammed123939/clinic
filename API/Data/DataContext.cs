using System.Text.RegularExpressions;
using API.entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<Store> Stores { get; set; }
    
    public DbSet<Schedule> Schedules { get; set; }
    public DbSet<Products> Products { get; set; }
    public DbSet<Orders> Orders { get; set; }
    public DbSet<Groups> Groups { get; set; }
    public DbSet<Admins> Admin { get; set; }
    // public DbSet<CaseDescription> CaseDescription { get; set; }
    public DbSet<Fields> Fields { get; set; }

    public DbSet<Photos> Photos { get; set; }
    public DbSet<Doctors> Doctors { get; set; }
    public DbSet<Patients> Patients { get; set; }
    public DbSet<Appointments> Appointments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Doctors>()
            .HasOne(d => d.Admins)
            .WithMany(a => a.Doctors);

        modelBuilder.Entity<Doctors>()
            .HasOne(d => d.Fields)
            .WithMany(f => f.Doctors);

       modelBuilder.Entity<Schedule>()
            .HasOne(s => s.Doctor)
            .WithMany(d => d.Schedules)
            .HasForeignKey(s => s.DoctorId);

        modelBuilder.Entity<Patients>()
            .HasOne(p => p.Admins)
            .WithMany(a => a.Patients);


        modelBuilder.Entity<Doctors>()
            .HasOne(d => d.Photos)
            .WithOne(p => p.Doctors);

        modelBuilder.Entity<Store>()
            .HasMany(s => s.Admins)
            .WithOne(a => a.store);

        modelBuilder.Entity<Products>()
            .HasOne(p => p.store)
            .WithOne(s => s.Products);

        modelBuilder.Entity<Orders>()
            .HasOne(o => o.Admins)
            .WithMany(a => a.orders);

        modelBuilder.Entity<Orders>()
            .HasOne(o => o.Products)
            .WithMany(p => p.orders);

        modelBuilder.Entity<Products>()
            .HasOne(p => p.Groups)
            .WithMany(g => g.Products);

        modelBuilder.Entity<Doctors>()
       .HasMany(d => d.appointments)
       .WithOne(a => a.Doctors);

        modelBuilder.Entity<Admins>()
       .HasMany(a => a.appointments)
       .WithOne(a => a.Admins);

        modelBuilder.Entity<Patients>()
       .HasMany(p => p.appointments)
       .WithOne(a => a.Patients);

        // modelBuilder.Entity<Doctors>().
        // HasMany(x => x.Patients)
        // .WithMany(y => y.Doctors)
        // .UsingEntity(j => j.ToTable("DoctorPatient"));

        // modelBuilder.Entity<Patients>().
        // HasMany(x => x.CaseDescription)
        // .WithMany(y => y.Patients)
        // .UsingEntity(j => j.ToTable("PatientCaseDescription"));

        // modelBuilder.Entity<Doctors>().
        // HasMany(x => x.CaseDescription)
        // .WithMany(y => y.Doctors)
        // .UsingEntity(j => j.ToTable("DoctorCaseDescription"));

        base.OnModelCreating(modelBuilder);
    }
}
