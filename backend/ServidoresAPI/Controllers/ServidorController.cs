using Microsoft.AspNetCore.Mvc;
using ServidoresAPI.Models;
using ServidoresAPI.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("servidores")]
public class ServidorController : ControllerBase
{
    private readonly ServidorRepository _repository;

    public ServidorController(ServidorRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var servidores = await _repository.GetAll();
        return Ok(servidores);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var servidor = await _repository.GetById(id);
            return Ok(servidor);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] Servidor servidor)
    {
        if (servidor == null)
        {
            return BadRequest("Servidor não pode ser nulo.");
        }

        if (string.IsNullOrEmpty(servidor.Nome))
        {
            return BadRequest("Nome é obrigatório.");
        }

        if (string.IsNullOrEmpty(servidor.Orgao))
        {
            return BadRequest("Órgão é obrigatório.");
        }

        if (string.IsNullOrEmpty(servidor.Lotacao))
        {
            return BadRequest("Lotação é obrigatória.");
        }

        bool emailExiste = await _repository.ExisteEmailAsync(servidor.Email);
        if (emailExiste)
        {
            return BadRequest(new { message = "Já existe um servidor com esse email." });
        }

        await _repository.Add(servidor);
        return Ok();
    }

    [HttpPost("bulk")]
    public async Task<IActionResult> AddBulk([FromBody] List<Servidor> servidores)
    {
        if (servidores == null || !servidores.Any())
        {
            return BadRequest("Nenhum servidor fornecido para criar.");
        }

        int servidoresCriados = 0;
        List<string> erros = new List<string>();

        foreach (var servidor in servidores)
        {
            if (string.IsNullOrEmpty(servidor.Nome))
            {
                erros.Add($"O nome é obrigatório para o servidor com dados: {System.Text.Json.JsonSerializer.Serialize(servidor)}");
                continue;
            }

            if (string.IsNullOrEmpty(servidor.Orgao))
            {
                erros.Add($"O órgão é obrigatório para o servidor com dados: {System.Text.Json.JsonSerializer.Serialize(servidor)}");
                continue;
            }

            if (string.IsNullOrEmpty(servidor.Lotacao))
            {
                erros.Add($"A lotação é obrigatória para o servidor com dados: {System.Text.Json.JsonSerializer.Serialize(servidor)}");
                continue;
            }

            bool emailExiste = await _repository.ExisteEmailAsync(servidor.Email);
            if (emailExiste)
            {
                erros.Add($"Já existe um servidor com o email '{servidor.Email}'.");
                continue;
            }

            await _repository.Add(servidor);
            servidoresCriados++;
        }

        if (erros.Any())
        {
            return BadRequest(new { message = $"{servidoresCriados} servidores criados com sucesso. Os seguintes erros ocorreram:", errors = erros });
        }

        return Ok(new { message = $"{servidoresCriados} servidores criados com sucesso." });
    }

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

        if (existingServidor.Email != servidor.Email)
        {
            var servidorComMesmoEmail = await _repository.GetByEmail(servidor.Email);
            if (servidorComMesmoEmail != null && servidorComMesmoEmail.Id != id)
            {
                return BadRequest(new { message = "Já existe um servidor com esse email." });
            }
        }

        existingServidor.Nome = servidor.Nome;
        existingServidor.Telefone = servidor.Telefone;
        existingServidor.Email = servidor.Email;
        existingServidor.Orgao = servidor.Orgao;
        existingServidor.Lotacao = servidor.Lotacao;
        existingServidor.Sala = servidor.Sala;

        await _repository.Update(existingServidor);
        return NoContent();
    }

    [HttpPut("inativar/{id}")]
    public async Task<IActionResult> Inativar(int id)
    {
        var servidor = await _repository.GetById(id);
        if (servidor == null)
        {
            return NotFound("Servidor não encontrado.");
        }

        servidor.Ativo = false;
        await _repository.Update(servidor);
        return NoContent();
    }

    [HttpPut("reativar/{id}")]
    public async Task<IActionResult> ReativarServidor(int id)
    {
        var servidor = await _repository.GetByIdAsync(id);
        if (servidor == null)
        {
            return NotFound(new { message = "Servidor não encontrado." });
        }

        servidor.Ativo = true;
        await _repository.UpdateAsync(servidor);
        return Ok(servidor);
    }

    [HttpDelete("excluir/{id}")]
    public async Task<IActionResult> ExcluirServidor(int id)
    {
        var servidor = await _repository.GetByIdAsync(id);
        if (servidor == null)
        {
            return NotFound(new { message = "Servidor não encontrado." });
        }

        await _repository.DeleteAsync(id);
        return NoContent();
    }

    [HttpGet("inativos")]
    public async Task<IActionResult> GetInativos()
    {
        var inativos = await _repository.GetServidoresInativosAsync();
        if (!inativos.Any())
        {
            return Ok(new { message = "Nenhum servidor inativo encontrado." });
        }
        return Ok(inativos);
    }

    [HttpGet("buscar")]
    public async Task<IActionResult> Search(string? nome, string? orgao, string? lotacao)
    {
        var servidores = await _repository.Search(nome, orgao, lotacao);
        return Ok(servidores);
    }

    [HttpGet("orgaos")]
    public async Task<IActionResult> GetOrgaos()
    {
        var orgaos = await _repository.GetAllOrgaos();
        return Ok(orgaos);
    }

    [HttpGet("lotacoes/{orgao}")]
    public async Task<IActionResult> GetLotacoesByOrgao(string orgao)
    {
        var lotacoes = await _repository.GetLotacoesByOrgao(orgao);
        if (lotacoes.Any())
        {
            return Ok(lotacoes);
        }
        else
        {
            return NotFound($"Nenhuma lotação encontrada para o órgão: {orgao}");
        }
    }
}