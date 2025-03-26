namespace ServidoresAPI.Models;

public class Servidor
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Orgao { get; set; } = string.Empty;
    public string Lotacao { get; set; } = string.Empty;
    public string Sala { get; set; } = string.Empty;
    public bool Ativo { get; set; } = true;
}