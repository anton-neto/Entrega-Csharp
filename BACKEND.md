# Controle de Estoque 📦

## 📋 Sobre o Projeto
Sistema de Controle de Estoque desenvolvido em .NET Core, utilizando Entity Framework Core e SQLite como banco de dados. O sistema permite gerenciar produtos, categorias, fornecedores e movimentações de estoque de forma eficiente e organizada.

## 👥 Autores
- Antonio Adair Cabreira Neto
- Gustavo Torres Giroto
- Victor Borges Anhaya

## 🚀 Tecnologias Utilizadas
- .NET Core 7.0
- Entity Framework Core
- SQLite
- ASP.NET Core Web API
- C#

## 📦 Estrutura do Projeto
```
ControleDeEstoque/
├── Models/                 # Classes de domínio
│   ├── Produto.cs         # Modelo de produto
│   ├── Categoria.cs       # Modelo de categoria
│   ├── Fornecedor.cs      # Modelo de fornecedor
│   ├── Movimentacao.cs    # Modelo de movimentação
│   └── Banco.cs           # População inicial do banco
├── Dao/                    # Camada de acesso a dados
│   └── AppDbContext.cs     # Contexto do Entity Framework
├── Rotas/                  # Endpoints da API
│   ├── ROTA_GET.cs        # Rotas de consulta
│   ├── ROTA_POST.cs       # Rotas de criação
│   └── ROTA_DELET.cs      # Rotas de exclusão
└── Program.cs             # Ponto de entrada da aplicação
```

## 🔄 Funcionalidades

### Produtos
- Cadastro de produtos com informações detalhadas
- Consulta de produtos por ID ou listagem completa
- Exclusão de produtos (com validação de movimentações)
- Atualização automática de estoque

### Categorias
- Gerenciamento de categorias de produtos
- Validação de exclusão (produtos associados)
- Consulta por ID ou listagem completa

### Fornecedores
- Cadastro completo de fornecedores
- Validação de exclusão (produtos associados)
- Consulta por ID ou listagem completa

### Movimentações
- Registro de entradas e saídas
- Atualização automática do estoque
- Histórico de movimentações por produto
- Validação de quantidade disponível

## 🛠️ Configuração do Ambiente

1. Clone o repositório
```bash
git clone https://github.com/anton-neto/ControleDeEstoque
```

2. Instale as dependências
```bash
dotnet restore
```

3. Execute o projeto
```bash
dotnet run
```

4. Acesse a API
```
http://localhost:5077
```

## 📚 Endpoints da API

### Produtos
- GET `/api/produto` - Lista todos os produtos
- GET `/api/produto/{id}` - Obtém produto específico
- POST `/api/produto` - Cria novo produto
- DELETE `/api/produto/{id}` - Remove produto

### Categorias
- GET `/api/categoria` - Lista todas as categorias
- GET `/api/categoria/{id}` - Obtém categoria específica
- POST `/api/categoria` - Cria nova categoria
- DELETE `/api/categoria/{id}` - Remove categoria

### Fornecedores
- GET `/api/fornecedor` - Lista todos os fornecedores
- GET `/api/fornecedor/{id}` - Obtém fornecedor específico
- POST `/api/fornecedor` - Cria novo fornecedor
- DELETE `/api/fornecedor/{id}` - Remove fornecedor

### Movimentações
- GET `/api/movimentacao` - Lista todas as movimentações
- GET `/api/movimentacao/{id}` - Obtém movimentação específica
- GET `/api/movimentacao/produto/{produtoId}` - Lista movimentações por produto
- POST `/api/movimentacao` - Registra nova movimentação
- DELETE `/api/movimentacao/{id}` - Remove movimentação

## 🔒 Validações e Regras de Negócio

1. **Produtos**
   - Não podem ser excluídos se possuírem movimentações
   - Quantidade não pode ficar negativa
   - Atualização automática de data de cadastro/atualização

2. **Categorias**
   - Não podem ser excluídas se possuírem produtos
   - Nome é obrigatório

3. **Fornecedores**
   - Não podem ser excluídos se possuírem produtos
   - CNPJ e contato são obrigatórios

4. **Movimentações**
   - Validação de quantidade disponível para saídas
   - Atualização automática do estoque
   - Registro de data e hora

## 📊 Banco de Dados

O projeto utiliza SQLite como banco de dados, com as seguintes características:
- Banco de dados local (`controleDeEstoque.db`)
- Criação automática do banco na primeira execução
- Dados iniciais populados automaticamente
- Relacionamentos configurados via Entity Framework

## 🔄 Fluxo de Dados

1. **Cadastro de Produto**
   - Validação de dados
   - Associação com categoria e fornecedor
   - Registro de data de cadastro

2. **Movimentação de Estoque**
   - Validação de quantidade
   - Atualização do estoque
   - Registro de data e hora
   - Observações opcionais

3. **Exclusão de Registros**
   - Validação de dependências
   - Reversão de movimentações (quando aplicável)
   - Confirmação de exclusão

## 🎯 Melhorias Futuras

1. Implementação de autenticação e autorização
2. Adição de relatórios e dashboards
3. Implementação de testes unitários
4. Adição de validações mais robustas
5. Implementação de cache
6. Adição de documentação Swagger
