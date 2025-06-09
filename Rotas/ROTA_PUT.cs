using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using controleDeEstoque.Models;
using controleDeEstoque.Dao;

namespace controleDeEstoque.Rotas;

public static class ROTA_PUT
{
    public static void MapPutRoutes(this WebApplication app)
    {
        app.MapPut("/api/produto/{id}", async (int id, Produto produtoAtualizado, AppDbContext context) =>
        {
            var produto = await context.Produtos.FindAsync(id);
            if (produto == null)
            {
                return Results.NotFound("Produto não encontrado.");
            }

            // Atualiza os dados do produto
            produto.nome = produtoAtualizado.nome;
            produto.descricao = produtoAtualizado.descricao;
            produto.preco = produtoAtualizado.preco;
            produto.quantidade = produtoAtualizado.quantidade;
            produto.categoriaId = produtoAtualizado.categoriaId;
            produto.fornecedorId = produtoAtualizado.fornecedorId;
            produto.dataAtualizacao = DateTime.Now;

            try
            {
                await context.SaveChangesAsync();
                return Results.Ok(produto);
            }
            catch (DbUpdateException ex)
            {
                return Results.BadRequest("Erro ao atualizar o produto: " + ex.Message);
            }
        });

        app.MapPut("/api/venda/{id}", async (int id, Venda vendaAtualizada, AppDbContext context) =>
        {
            var venda = await context.Vendas.FindAsync(id);
            if (venda == null)
            {
                return Results.NotFound("Venda não encontrada.");
            }

            venda.quantidade = vendaAtualizada.quantidade;
            venda.observacao = vendaAtualizada.observacao;
            venda.precoUnitario = vendaAtualizada.precoUnitario;
            venda.total = vendaAtualizada.total;
            venda.data = vendaAtualizada.data;
            venda.produtoId = vendaAtualizada.produtoId;

            try
            {
                await context.SaveChangesAsync();
                return Results.Ok(venda);
            }
            catch (DbUpdateException ex)
            {
                return Results.BadRequest("Erro ao atualizar a venda: " + ex.Message);
            }
        });
    }
} 