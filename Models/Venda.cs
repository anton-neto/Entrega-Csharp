using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace controleDeEstoque.Models;

public class Venda
{
    [Key]
    public int id { get; set; }

    public int produtoId { get; set; }

    [JsonIgnore]
    public virtual Produto produto { get; set; }

    public int quantidade { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal precoUnitario { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal total { get; set; }

    public DateTime data { get; set; }

    public string? observacao { get; set; }
} 