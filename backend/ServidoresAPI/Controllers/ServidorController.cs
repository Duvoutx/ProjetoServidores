using Microsoft.AspNetCore.Mvc;
using ServidoresAPI.Models;
using ServidoresAPI.Data;
using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations;
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

    // 1. Listagem de Servidores
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var servidores = await _repository.GetAll();
        return Ok(servidores);
    }

    // 2. Cadastro de Servidores
    [HttpPost]
    public async Task<IActionResult> Add([FromBody] Servidor servidor)
    {
        // Validação manual
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
        // Verifica se o email já está em uso
        bool emailExiste = await _repository.ExisteEmailAsync(servidor.Email);

        if (emailExiste)
        {
            // Retorna um erro para o frontend se o email já existir
            return BadRequest(new { message = "Já existe um servidor com esse email." });
        }

        // Se a validação passar, adicione o servidor
        await _repository.Add(servidor);
        return Ok();
    }

    // Novo Endpoint para Cadastro em Lote
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
            // Validação manual para cada servidor
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

            // Verifica se o email já está em uso
            bool emailExiste = await _repository.ExisteEmailAsync(servidor.Email);
            if (emailExiste)
            {
                erros.Add($"Já existe um servidor com o email '{servidor.Email}'.");
                continue;
            }

            // Se a validação passar, adicione o servidor
            await _repository.Add(servidor);
            servidoresCriados++;
        }

        if (erros.Any())
        {
            return BadRequest(new { message = $"{servidoresCriados} servidores criados com sucesso. Os seguintes erros ocorreram:", errors = erros });
        }

        return Ok(new { message = $"{servidoresCriados} servidores criados com sucesso." });
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

        // Verificar se o novo e-mail já existe para outro servidor
        if (existingServidor.Email != servidor.Email) // Só verificar se o e-mail foi alterado
        {
            var servidorComMesmoEmail = await _repository.GetByEmail(servidor.Email); // Você precisará criar este método no seu repositório
            if (servidorComMesmoEmail != null && servidorComMesmoEmail.Id != id) // Certificar que não é o mesmo servidor sendo editado
            {
                return BadRequest(new { message = "Já existe um servidor com esse email." });
            }
        }

        // Atualizando os dados do servidor
        existingServidor.Nome = servidor.Nome;
        existingServidor.Telefone = servidor.Telefone;
        existingServidor.Email = servidor.Email;
        existingServidor.Orgao = servidor.Orgao;
        existingServidor.Lotacao = servidor.Lotacao;
        existingServidor.Sala = servidor.Sala;

        await _repository.Update(existingServidor);
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

    // 4. Inativação de Servidor (Exclusão Lógica)
    [HttpPut("inativar/{id}")]
    public async Task<IActionResult> Inativar(int id)
    {
        var servidor = await _repository.GetById(id);
        if (servidor == null)
        {
            return NotFound("Servidor não encontrado.");
        }

        servidor.Ativo = false;   // Marca como inativo
        await _repository.Update(servidor);
        return NoContent();   // Status 204 - Inativação bem-sucedida
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

    // Método para excluir definitivamente um servidor
    [HttpDelete("excluir/{id}")]
    public async Task<IActionResult> ExcluirServidor(int id)
    {
        var servidor = await _repository.GetByIdAsync(id);
        if (servidor == null)
        {
            return NotFound(new { message = "Servidor não encontrado." });
        }

        await _repository.DeleteAsync(id); // Chama o método que remove do banco
        return NoContent(); // Retorna NoContent após a remoção
    }

    // 5. Busca de Servidores por nome, órgão ou lotação
    [HttpGet("buscar")]
    public async Task<IActionResult> Search(string? nome, string? orgao, string? lotacao)
    {
        var servidores = await _repository.Search(nome, orgao, lotacao);
        return Ok(servidores);
    }
    // Método GET para buscar órgãos
    [HttpGet("orgaos")]
    public IActionResult GetOrgaos()
    {
        // Lógica para retornar os órgãos
        var orgaos = new List<string> { "Órgão 1", "Órgão 2" };
        return Ok(orgaos);   // Retorna os órgãos
    }

    // Método GET para buscar lotações por órgão
    [HttpGet("lotacoes/{orgao}")]  // Método GET específico para /servidores/lotacoes/{orgao}
    public IActionResult GetLotacoesByOrgao(string orgao)
    {
        // Simulando as lotações baseadas no órgão
        var lotacoes = orgao switch
        {
            "Órgão 1" => new List<string> { "Lotação 1", "Lotação 2" },
            "Órgão 2" => new List<string> { "Lotação 3", "Lotação 4" },
            _ => new List<string>()    // Caso o órgão não seja encontrado, retorna uma lista vazia
        };

        if (lotacoes.Any())
        {
            return Ok(lotacoes); // Retorna as lotações
        }
        else
        {
            return NotFound($"Nenhuma lotação encontrada para o órgão: {orgao}");
        }
    }
}