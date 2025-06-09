using System.Text.Json.Serialization;

namespace controleDeEstoque.Models;

public class Categoria
{
    public int id { get; set; }
    public string nome { get; set; }
    public string descricao { get; set; }

    [JsonIgnore]
    public ICollection<Produto> Produtos { get; set; }
} 