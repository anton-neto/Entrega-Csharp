using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using controleDeEstoque.Models;
using controleDeEstoque.Dao;

namespace controleDeEstoque.Rotas;

public static class ROTA_GET
{
    public static void MapGetRoutes(this WebApplication app)
    {
        app.MapGet("/api/produto", async (AppDbContext context) =>
        {
            var produtos = await context.Produtos
                .Include(p => p.categoria)
                .Include(p => p.fornecedor)
                .ToListAsync();
            if (produtos == null || produtos.Count == 0)
            {
                return Results.NotFound("Nenhum produto encontrado.");
            }
            return Results.Ok(produtos);
        });

        app.MapGet("/api/produto/{id}", async (int id, AppDbContext context) =>
        {
            var produto = await context.Produtos
                .Include(p => p.categoria)
                .Include(p => p.fornecedor)
                .FirstOrDefaultAsync(p => p.id == id);
            if (produto == null)
            {
                return Results.NotFound("Produto não encontrado.");
            }
            return Results.Ok(produto);
        });

        app.MapGet("/api/categoria", async (AppDbContext context) =>
        {
            var categorias = await context.Categorias.ToListAsync();
            if (categorias == null || categorias.Count == 0)
            {
                return Results.NotFound("Nenhuma categoria encontrada.");
            }
            return Results.Ok(categorias);
        });

        app.MapGet("/api/categoria/{id}", async (int id, AppDbContext context) =>
        {
            var categoria = await context.Categorias.FindAsync(id);
            if (categoria == null)
            {
                return Results.NotFound("Categoria não encontrada.");
            }
            return Results.Ok(categoria);
        });

        app.MapGet("/api/fornecedor", async (AppDbContext context) =>
        {
            var fornecedores = await context.Fornecedores.ToListAsync();
            if (fornecedores == null || fornecedores.Count == 0)
            {
                return Results.NotFound("Nenhum fornecedor encontrado.");
            }
            return Results.Ok(fornecedores);
        });

        app.MapGet("/api/fornecedor/{id}", async (int id, AppDbContext context) =>
        {
            var fornecedor = await context.Fornecedores.FindAsync(id);
            if (fornecedor == null)
            {
                return Results.NotFound("Fornecedor não encontrado.");
            }
            return Results.Ok(fornecedor);
        });

        app.MapGet("/api/movimentacao", async (AppDbContext context) =>
        {
            var movimentacoes = await context.Movimentacoes
                .Include(m => m.produto)
                .ToListAsync();
            if (movimentacoes == null || movimentacoes.Count == 0)
            {
                return Results.NotFound("Nenhuma movimentação encontrada.");
            }
            return Results.Ok(movimentacoes);
        });

        app.MapGet("/api/movimentacao/{id}", async (int id, AppDbContext context) =>
        {
            var movimentacao = await context.Movimentacoes
                .Include(m => m.produto)
                .FirstOrDefaultAsync(m => m.id == id);
            if (movimentacao == null)
            {
                return Results.NotFound("Movimentação não encontrada.");
            }
            return Results.Ok(movimentacao);
        });

        app.MapGet("/api/movimentacao/produto/{produtoId}", async (int produtoId, AppDbContext context) =>
        {
            var movimentacoes = await context.Movimentacoes
                .Include(m => m.produto)
                .Where(m => m.produtoId == produtoId)
                .ToListAsync();
            if (movimentacoes == null || movimentacoes.Count == 0)
            {
                return Results.NotFound("Nenhuma movimentação encontrada para este produto.");
            }
            return Results.Ok(movimentacoes);
        });

        app.MapGet("/api/venda", async (AppDbContext context) =>
        {
            var vendas = await context.Vendas
                .Include(v => v.produto)
                .ToListAsync();
            if (vendas == null || vendas.Count == 0)
            {
                return Results.NotFound("Nenhuma venda encontrada.");
            }
            return Results.Ok(vendas);
        });

        app.MapGet("/api/venda/{id}", async (int id, AppDbContext context) =>
        {
            var venda = await context.Vendas
                .Include(v => v.produto)
                .FirstOrDefaultAsync(v => v.id == id);
            if (venda == null)
            {
                return Results.NotFound("Venda não encontrada.");
            }
            return Results.Ok(venda);
        });

        app.MapGet("/api/venda/produto/{produtoId}", async (int produtoId, AppDbContext context) =>
        {
            var vendas = await context.Vendas
                .Include(v => v.produto)
                .Where(v => v.produtoId == produtoId)
                .ToListAsync();
            if (vendas == null || vendas.Count == 0)
            {
                return Results.NotFound("Nenhuma venda encontrada para este produto.");
            }
            return Results.Ok(vendas);
        });
    }
} 