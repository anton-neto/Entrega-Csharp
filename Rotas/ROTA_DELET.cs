using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using controleDeEstoque.Models;
using controleDeEstoque.Dao;

namespace controleDeEstoque.Rotas;

public static class ROTA_DELET
{
    public static void MapDeleteRoutes(this WebApplication app)
    {
        app.MapDelete("/api/produto/{id}", async (int id, AppDbContext context) =>
        {
            var produto = await context.Produtos.FindAsync(id);
            if (produto == null)
            {
                return Results.NotFound("Produto não encontrado.");
            }

            var hasMovimentacoes = await context.Movimentacoes.AnyAsync(m => m.produtoId == id);
            if (hasMovimentacoes)
            {
                return Results.BadRequest("Não é possível excluir o produto, pois há movimentações associadas a ele.");
            }

            context.Produtos.Remove(produto);
            await context.SaveChangesAsync();
            return Results.Ok("Produto deletado com sucesso.");
        });

        app.MapDelete("/api/categoria/{id}", async (int id, AppDbContext context) =>
        {
            var categoria = await context.Categorias.FindAsync(id);
            if (categoria == null)
            {
                return Results.NotFound("Categoria não encontrada.");
            }

            var hasProdutos = await context.Produtos.AnyAsync(p => p.categoriaId == id);
            if (hasProdutos)
            {
                return Results.BadRequest("Não é possível excluir a categoria, pois há produtos associados a ela.");
            }

            context.Categorias.Remove(categoria);
            await context.SaveChangesAsync();
            return Results.Ok("Categoria deletada com sucesso.");
        });

        app.MapDelete("/api/fornecedor/{id}", async (int id, AppDbContext context) =>
        {
            var fornecedor = await context.Fornecedores.FindAsync(id);
            if (fornecedor == null)
            {
                return Results.NotFound("Fornecedor não encontrado.");
            }

            var hasProdutos = await context.Produtos.AnyAsync(p => p.fornecedorId == id);
            if (hasProdutos)
            {
                return Results.BadRequest("Não é possível excluir o fornecedor, pois há produtos associados a ele.");
            }

            context.Fornecedores.Remove(fornecedor);
            await context.SaveChangesAsync();
            return Results.Ok("Fornecedor deletado com sucesso.");
        });

        app.MapDelete("/api/movimentacao/{id}", async (int id, AppDbContext context) =>
        {
            var movimentacao = await context.Movimentacoes.FindAsync(id);
            if (movimentacao == null)
            {
                return Results.NotFound("Movimentação não encontrada.");
            }

            var produto = await context.Produtos.FindAsync(movimentacao.produtoId);
            if (produto != null)
            {
                if (movimentacao.tipo == "Entrada")
                {
                    produto.quantidade -= movimentacao.quantidade;
                }
                else if (movimentacao.tipo == "Saída")
                {
                    produto.quantidade += movimentacao.quantidade;
                }
                produto.dataAtualizacao = DateTime.Now;
            }

            context.Movimentacoes.Remove(movimentacao);
            await context.SaveChangesAsync();
            return Results.Ok("Movimentação deletada com sucesso.");
        });

        app.MapDelete("/api/venda/{id}", async (int id, AppDbContext context) =>
        {
            var venda = await context.Vendas.FindAsync(id);
            if (venda == null)
            {
                return Results.NotFound("Venda não encontrada.");
            }

            var produto = await context.Produtos.FindAsync(venda.produtoId);
            if (produto != null)
            {
                produto.quantidade += venda.quantidade;
                produto.dataAtualizacao = DateTime.Now;
            }

            context.Vendas.Remove(venda);
            await context.SaveChangesAsync();
            return Results.Ok("Venda deletada com sucesso.");
        });
    }
} 