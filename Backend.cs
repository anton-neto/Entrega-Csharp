using controleDeEstoque.Models;
using controleDeEstoque.Dao;
using controleDeEstoque.Rotas;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

builder.Services.AddDbContext<AppDbContext>();
var app = builder.Build();

app.UseCors();
app.UseRouting();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "front")),
    RequestPath = ""
});

Banco.PopularBancoDeDados(app.Services);

app.MapGet("/", async context =>
{
    context.Response.ContentType = "text/html";
    await context.Response.SendFileAsync(Path.Combine(Directory.GetCurrentDirectory(), "front", "index.html"));
});

app.MapGetRoutes();
app.MapPostRoutes();
app.MapPutRoutes();
app.MapDeleteRoutes();

app.Urls.Add("http://localhost:5077");

app.Run(); 