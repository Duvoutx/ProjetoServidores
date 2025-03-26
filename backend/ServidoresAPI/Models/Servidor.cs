using System.ComponentModel.DataAnnotations;

namespace ServidoresAPI.Models;

public class Servidor
{
    public int Id { get; set; }

    [Required(ErrorMessage = "O Nome é obrigatório.")]
    public string Nome { get; set; } = string.Empty;

    public string Telefone { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "O Órgão é obrigatório.")]
    public string Orgao { get; set; } = string.Empty;

    [Required(ErrorMessage = "A Lotação é obrigatória.")]
    public string Lotacao { get; set; } = string.Empty;

    public string Sala { get; set; } = string.Empty;

    public bool Ativo { get; set; } = true;
}