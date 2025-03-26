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

    // Buscar
    public async Task<Servidor> GetById(int id)
    {
        var servidor = await _context.Servidores.FindAsync(id);
        if (servidor == null) throw new KeyNotFoundException($"Servidor com id {id} não encontrado.");
        return servidor;
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
    public async Task<List<Servidor>> Search(string nome, string orgao, string lotacao)
    {
        var query = _context.Servidores.AsQueryable(); 

        if (!string.IsNullOrEmpty(nome))
        {
            query = query.Where(s => s.Nome.Contains(nome)); 
        }

        if (!string.IsNullOrEmpty(orgao))
        {
            query = query.Where(s => s.Orgao.Contains(orgao)); 
        }

        if (!string.IsNullOrEmpty(lotacao))
        {
            query = query.Where(s => s.Lotacao.Contains(lotacao)); 
        }

        return await query.Where(s => s.Ativo).ToListAsync(); 
    }
}
