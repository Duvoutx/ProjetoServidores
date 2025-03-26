using Microsoft.AspNetCore.Mvc;
using ServidoresAPI.Models;

[ApiController]
[Route("servidores")]
public class ServidorController : ControllerBase
{
    private readonly ServidorRepository _repository;

    public ServidorController(ServidorRepository repository)
    {
        _repository = repository;
    }

    // 1. Listagem de Servidores
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var servidores = await _repository.GetAll();
        return Ok(servidores);
    }

    // 2. Cadastro de Servidores
    [HttpPost]
    public async Task<IActionResult> Add(Servidor servidor)
    {
        if (servidor == null)
        {
            return BadRequest("Servidor não pode ser nulo.");
        }

        await _repository.Add(servidor);
        return CreatedAtAction(nameof(GetAll), new { id = servidor.Id }, servidor);
    }

    // 3. Atualização de Servidores
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Servidor servidor)
    {
        if (servidor == null || id != servidor.Id)
        {
            return BadRequest("Dados do servidor inconsistentes.");
        }

        var existingServidor = await _repository.GetById(id);
        if (existingServidor == null)
        {
            return NotFound("Servidor não encontrado.");
        }

        // Atualizando os dados do servidor
        existingServidor.Nome = servidor.Nome;
        existingServidor.Telefone = servidor.Telefone;
        existingServidor.Email = servidor.Email;
        existingServidor.Orgao = servidor.Orgao;
        existingServidor.Lotacao = servidor.Lotacao;
        existingServidor.Sala = servidor.Sala;

        await _repository.Update(existingServidor);
        return NoContent();  // Status 204 - Atualização bem-sucedida
    }

    // 4. Inativação de Servidor (Exclusão Lógica)
    [HttpPut("inativar/{id}")]
    public async Task<IActionResult> Inativar(int id)
    {
        var servidor = await _repository.GetById(id);
        if (servidor == null)
        {
            return NotFound("Servidor não encontrado.");
        }

        servidor.Ativo = false;  // Marca como inativo
        await _repository.Update(servidor);
        return NoContent();  // Status 204 - Inativação bem-sucedida
    }

    // 5. Busca de Servidores por nome, órgão ou lotação
    [HttpGet("buscar")]
    public async Task<IActionResult> Search([FromQuery] string nome, [FromQuery] string orgao, [FromQuery] string lotacao)
    {
        var servidores = await _repository.Search(nome, orgao, lotacao);
        return Ok(servidores);
    }
}