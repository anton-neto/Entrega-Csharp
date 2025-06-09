using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using controleDeEstoque.Models;
using controleDeEstoque.Dao;

namespace controleDeEstoque.Rotas;

public static class ROTA_POST
{
    public static void MapPostRoutes(this WebApplication app)
    {
        app.MapPost("/api/produto", async (Produto produto, AppDbContext context) =>
        {
            produto.dataCadastro = DateTime.Now;
            context.Produtos.Add(produto);
            await context.SaveChangesAsync();
            return Results.Created($"/api/produto/{produto.id}", produto);
        });

        app.MapPost("/api/categoria", async (Categoria categoria, AppDbContext context) =>
        {
            context.Categorias.Add(categoria);
            await context.SaveChangesAsync();
            return Results.Created($"/api/categoria/{categoria.id}", categoria);
        });

        app.MapPost("/api/fornecedor", async (Fornecedor fornecedor, AppDbContext context) =>
        {
            context.Fornecedores.Add(fornecedor);
            await context.SaveChangesAsync();
            return Results.Created($"/api/fornecedor/{fornecedor.id}", fornecedor);
        });

        app.MapPost("/api/movimentacao", async (Movimentacao movimentacao, AppDbContext context) =>
        {
            var produto = await context.Produtos.FindAsync(movimentacao.produtoId);
            if (produto == null)
            {
                return Results.NotFound("Produto não encontrado.");
            }

            if (movimentacao.tipo == "Entrada")
            {
                produto.quantidade += movimentacao.quantidade;
            }
            else if (movimentacao.tipo == "Saída")
            {
                if (produto.quantidade < movimentacao.quantidade)
                {
                    return Results.BadRequest("Quantidade insuficiente em estoque.");
                }
                produto.quantidade -= movimentacao.quantidade;
            }

            produto.dataAtualizacao = DateTime.Now;
            movimentacao.data = DateTime.Now;
            
            context.Movimentacoes.Add(movimentacao);
            await context.SaveChangesAsync();
            return Results.Created($"/api/movimentacao/{movimentacao.id}", movimentacao);
        });

        app.MapPost("/api/venda", async (Venda venda, AppDbContext context) =>
        {
            var produto = await context.Produtos.FindAsync(venda.produtoId);
            if (produto == null)
            {
                return Results.NotFound("Produto não encontrado.");
            }

            if (produto.quantidade < venda.quantidade)
            {
                return Results.BadRequest("Quantidade insuficiente em estoque.");
            }

            produto.quantidade -= venda.quantidade;
            produto.dataAtualizacao = DateTime.Now;
            venda.precoUnitario = produto.preco;
            venda.total = produto.preco * venda.quantidade;
            venda.data = DateTime.Now;

            context.Vendas.Add(venda);
            await context.SaveChangesAsync();
            return Results.Created($"/api/venda/{venda.id}", venda);
        });
    }
} 