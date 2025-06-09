using System.Text.Json.Serialization;

namespace controleDeEstoque.Models;

public class Fornecedor
{
    public int id { get; set; }
    public string nome { get; set; }
    public string cnpj { get; set; }
    public string telefone { get; set; }
    public string email { get; set; }
    public string endereco { get; set; }
    public string cidade { get; set; }
    public string estado { get; set; }
    public string cep { get; set; }

    [JsonIgnore]
    public ICollection<Produto> Produtos { get; set; }
} 