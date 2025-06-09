using System.Text.Json.Serialization;

namespace controleDeEstoque.Models;

public class Movimentacao
{
    public int id { get; set; }
    public int produtoId { get; set; }
    public Produto produto { get; set; }
    public string tipo { get; set; } 
    public int quantidade { get; set; }
    public DateTime data { get; set; }
    public string observacao { get; set; }
} 