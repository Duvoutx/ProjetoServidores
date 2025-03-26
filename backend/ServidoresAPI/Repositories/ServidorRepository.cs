using ServidoresAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ServidoresAPI.Data;

public class ServidorRepository
{
    private readonly AppDbContext _context;

    
    public ServidorRepository(AppDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context)); 
    }

    // Listar
    public async Task<List<Servidor>> GetAll()
    {
        // Retorna os servidores com status "Ativo"
        return await _context.Servidores.Where(s => s.Ativo).ToListAsync();
    }

    // Adicionar
    public async Task Add(Servidor servidor)
    {
        if (servidor == null) throw new ArgumentNullException(nameof(servidor)); 
        _context.Servidores.Add(servidor); 
        await _context.SaveChangesAsync(); 
    }
    public async Task<bool> ExisteEmailAsync(string email)
    {
        // Verifica se já existe algum servidor com o mesmo email
        var servidorExistente = await _context.Servidores
                                              .FirstOrDefaultAsync(s => s.Email == email);

        return servidorExistente != null; // Retorna true se encontrar, false caso contrário
    }
    // Buscar
    public async Task<Servidor> GetById(int id)
    {
        var servidor = await _context.Servidores.FindAsync(id);
        if (servidor == null) throw new KeyNotFoundException($"Servidor com id {id} não encontrado.");
        return servidor;
    }

    public async Task<IEnumerable<Servidor>> GetServidoresInativosAsync()
    {
        return await _context.Servidores.Where(s => !s.Ativo).ToListAsync();
    }

    // Método para inativar (exclusão lógica) um servidor
    public async Task InactivateAsync(int id)
    {
        var servidor = await GetByIdAsync(id);
        if (servidor != null)
        {
            servidor.Ativo = false;
            await _context.SaveChangesAsync();
        }
    }
    public async Task<Servidor> GetByIdAsync(int id)
    {
        return await _context.Servidores.FindAsync(id);
    }

    public async Task UpdateAsync(Servidor servidor)
    {
        _context.Servidores.Update(servidor);
        await _context.SaveChangesAsync();
    }
    // Método para excluir definitivamente um servidor
    public async Task DeleteAsync(int id)
    {
        var servidor = await GetByIdAsync(id);
        if (servidor != null)
        {
            _context.Servidores.Remove(servidor);
            await _context.SaveChangesAsync();
        }
    }


    public async Task<List<string>> GetAllOrgaos()
    {
        return await _context.Servidores
                             .Where(s => !string.IsNullOrEmpty(s.Orgao))
                             .Select(s => s.Orgao)
                             .Distinct()
                             .ToListAsync();
    }
    public async Task<List<string>> GetLotacoesByOrgao(string orgao)
    {
        // Retorne uma lista de lotações válidas para o órgão
        return await _context.Servidores
                             .Where(s => s.Orgao == orgao)
                             .Select(s => s.Lotacao)
                             .Distinct()
                             .ToListAsync();
    }

    // Atualizar
    public async Task Update(Servidor servidor)
    {
        if (servidor == null) throw new ArgumentNullException(nameof(servidor));
        _context.Servidores.Update(servidor); 
        await _context.SaveChangesAsync(); 
    }

    // Inativação
    public async Task Inactivate(int id)
    {
        var servidor = await GetById(id); 
        servidor.Ativo = false; 
        _context.Servidores.Update(servidor); 
        await _context.SaveChangesAsync(); 
    }

    // Filtrar
    public async Task<List<Servidor>> Search(string? nome, string? orgao, string? lotacao)
    {
        var query = _context.Servidores.AsQueryable();
        if (!string.IsNullOrEmpty(nome))
        {
            query = query.Where(s => s.Nome.StartsWith(nome));
        }

        if (!string.IsNullOrEmpty(orgao))
        {
            query = query.Where(s => s.Orgao.StartsWith(orgao));
        }

        if (!string.IsNullOrEmpty(lotacao))
        {
            query = query.Where(s => s.Lotacao.StartsWith(lotacao));
        }

        return await query.Where(s => s.Ativo).ToListAsync();
    }
}
