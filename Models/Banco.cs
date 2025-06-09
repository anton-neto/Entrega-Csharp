namespace controleDeEstoque.Models;
using Microsoft.Extensions.DependencyInjection;
using controleDeEstoque.Dao;

public static class Banco
{
    public static void PopularBancoDeDados(IServiceProvider app)
    {
        using (var scope = app.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            
            // Garante que o banco de dados existe
            context.Database.EnsureCreated();

            // Só popula os dados iniciais se não houver nenhuma categoria
            if (!context.Categorias.Any())
            {
                context.Categorias.Add(new Categoria { nome = "Motor", descricao = "Peças do motor e componentes relacionados" });
                context.Categorias.Add(new Categoria { nome = "Suspensão", descricao = "Componentes de suspensão e direção" });
                context.Categorias.Add(new Categoria { nome = "Freios", descricao = "Sistema de freios e componentes" });
                context.Categorias.Add(new Categoria { nome = "Elétrica", descricao = "Componentes elétricos e eletrônicos" });
                context.Categorias.Add(new Categoria { nome = "Acessórios", descricao = "Acessórios e itens de customização" });
                context.SaveChanges();
            }

            if (!context.Fornecedores.Any())
            {
                context.Fornecedores.Add(new Fornecedor { 
                    nome = "Auto Parts Brasil", 
                    cnpj = "12345678901234", 
                    telefone = "41987654321",
                    email = "contato@autoparts.com.br",
                    endereco = "Av. Industrial, 1000",
                    cidade = "Curitiba",
                    estado = "PR",
                    cep = "80000-000"
                });
                context.Fornecedores.Add(new Fornecedor { 
                    nome = "Mecânica Express", 
                    cnpj = "23456789012345", 
                    telefone = "41987654322",
                    email = "contato@mecanicaexpress.com.br",
                    endereco = "Rua das Oficinas, 500",
                    cidade = "São Paulo",
                    estado = "SP",
                    cep = "01310-000"
                });
                context.SaveChanges();
            }

            if (!context.Produtos.Any())
            {
                context.Produtos.Add(new Produto { 
                    nome = "Filtro de Óleo", 
                    descricao = "Filtro de óleo universal", 
                    preco = 35.00m,
                    quantidade = 50,
                    categoriaId = 1,
                    fornecedorId = 1,
                    dataCadastro = DateTime.Now
                });
                context.Produtos.Add(new Produto { 
                    nome = "Amortecedor Dianteiro", 
                    descricao = "Par de amortecedores dianteiros", 
                    preco = 450.00m,
                    quantidade = 15,
                    categoriaId = 2,
                    fornecedorId = 1,
                    dataCadastro = DateTime.Now
                });
                context.Produtos.Add(new Produto { 
                    nome = "Pastilha de Freio", 
                    descricao = "Jogo de pastilhas de freio dianteiras", 
                    preco = 120.00m,
                    quantidade = 30,
                    categoriaId = 3,
                    fornecedorId = 2,
                    dataCadastro = DateTime.Now
                });
                context.Produtos.Add(new Produto { 
                    nome = "Bateria 60Ah", 
                    descricao = "Bateria automotiva 60Ah", 
                    preco = 350.00m,
                    quantidade = 20,
                    categoriaId = 4,
                    fornecedorId = 1,
                    dataCadastro = DateTime.Now
                });
                context.Produtos.Add(new Produto { 
                    nome = "Óleo de Motor", 
                    descricao = "Óleo sintético 5W30 1L", 
                    preco = 45.00m,
                    quantidade = 100,
                    categoriaId = 1,
                    fornecedorId = 2,
                    dataCadastro = DateTime.Now
                });
                context.Produtos.Add(new Produto { 
                    nome = "Farol LED", 
                    descricao = "Kit farol LED universal", 
                    preco = 280.00m,
                    quantidade = 25,
                    categoriaId = 4,
                    fornecedorId = 1,
                    dataCadastro = DateTime.Now
                });
                context.Produtos.Add(new Produto { 
                    nome = "Mola Esportiva", 
                    descricao = "Kit mola esportiva universal", 
                    preco = 850.00m,
                    quantidade = 10,
                    categoriaId = 2,
                    fornecedorId = 2,
                    dataCadastro = DateTime.Now
                });
                context.Produtos.Add(new Produto { 
                    nome = "Disco de Freio", 
                    descricao = "Par de discos de freio ventilados", 
                    preco = 320.00m,
                    quantidade = 20,
                    categoriaId = 3,
                    fornecedorId = 1,
                    dataCadastro = DateTime.Now
                });
                context.Produtos.Add(new Produto { 
                    nome = "Alarme Automotivo", 
                    descricao = "Kit alarme com central", 
                    preco = 450.00m,
                    quantidade = 15,
                    categoriaId = 4,
                    fornecedorId = 2,
                    dataCadastro = DateTime.Now
                });
                context.Produtos.Add(new Produto { 
                    nome = "Jogo de Rodas", 
                    descricao = "Jogo de rodas aro 17", 
                    preco = 2800.00m,
                    quantidade = 8,
                    categoriaId = 5,
                    fornecedorId = 1,
                    dataCadastro = DateTime.Now
                });
                context.SaveChanges();
            }

            if (!context.Movimentacoes.Any())
            {
                context.Movimentacoes.Add(new Movimentacao { 
                    produtoId = 1,
                    tipo = "Entrada",
                    quantidade = 50,
                    data = DateTime.Now,
                    observacao = "Entrada inicial de estoque"
                });
                context.Movimentacoes.Add(new Movimentacao { 
                    produtoId = 2,
                    tipo = "Entrada",
                    quantidade = 15,
                    data = DateTime.Now,
                    observacao = "Entrada inicial de estoque"
                });
                context.Movimentacoes.Add(new Movimentacao { 
                    produtoId = 3,
                    tipo = "Entrada",
                    quantidade = 30,
                    data = DateTime.Now,
                    observacao = "Entrada inicial de estoque"
                });
                context.SaveChanges();
            }

            if (!context.Vendas.Any())
            {
                context.Vendas.Add(new Venda { 
                    produtoId = 1,
                    quantidade = 2,
                    precoUnitario = 35.00m,
                    total = 70.00m,
                    data = DateTime.Now,
                    observacao = "Venda inicial"
                });
                context.Vendas.Add(new Venda { 
                    produtoId = 3,
                    quantidade = 1,
                    precoUnitario = 120.00m,
                    total = 120.00m,
                    data = DateTime.Now,
                    observacao = "Venda inicial"
                });
                context.SaveChanges();
            }
        }
    }
} 