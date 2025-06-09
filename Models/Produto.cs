using System.Text.Json.Serialization;

namespace controleDeEstoque.Models;

public class Produto
{
    public int id { get; set; }
    public string nome { get; set; }
    public string descricao { get; set; }
    public decimal preco { get; set; }
    public int quantidade { get; set; }
    public int categoriaId { get; set; }
    public Categoria categoria { get; set; }
    public int fornecedorId { get; set; }
    public Fornecedor fornecedor { get; set; }
    public DateTime dataCadastro { get; set; }
    public DateTime? dataAtualizacao { get; set; }

    [JsonIgnore]
    public ICollection<Movimentacao> Movimentacoes { get; set; }

    [JsonIgnore]
    public ICollection<Venda> Vendas { get; set; }
} 