using ServidoresAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ServidoresAPI.Data
{
    public class ServidorRepository
    {
        private readonly AppDbContext _context;

        public ServidorRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<List<Servidor>> GetAll()
        {
            return await _context.Servidores.Where(s => s.Ativo).ToListAsync();
        }

        public async Task<Servidor> GetById(int id)
        {
            var servidor = await _context.Servidores.FindAsync(id);
            if (servidor == null) throw new KeyNotFoundException($"Servidor com id {id} não encontrado.");
            return servidor;
        }

        public async Task<Servidor> GetByEmail(string email)
        {
            return await _context.Servidores.FirstOrDefaultAsync(s => s.Email == email);
        }

        public async Task Add(Servidor servidor)
        {
            if (servidor == null) throw new ArgumentNullException(nameof(servidor));
            _context.Servidores.Add(servidor);
            await _context.SaveChangesAsync();
        }

        public async Task Update(Servidor servidor)
        {
            if (servidor == null) throw new ArgumentNullException(nameof(servidor));
            _context.Servidores.Update(servidor);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var servidor = await GetByIdAsync(id);
            if (servidor != null)
            {
                _context.Servidores.Remove(servidor);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExisteEmailAsync(string email)
        {
            return await _context.Servidores.AnyAsync(s => s.Email == email);
        }

        public async Task<IEnumerable<Servidor>> GetServidoresInativosAsync()
        {
            return await _context.Servidores.Where(s => !s.Ativo).ToListAsync();
        }

        public async Task Inactivate(int id)
        {
            var servidor = await GetById(id);
            if (servidor != null)
            {
                servidor.Ativo = false;
                _context.Servidores.Update(servidor);
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
            return await _context.Servidores
                .Where(s => s.Orgao == orgao)
                .Select(s => s.Lotacao)
                .Distinct()
                .ToListAsync();
        }

        public async Task<List<Servidor>> Search(string? nome, string? orgao, string? lotacao)
        {
            var query = _context.Servidores.AsQueryable();

            if (!string.IsNullOrEmpty(nome))
            {
                query = query.Where(s => s.Nome.ToLower().StartsWith(nome.ToLower()));
            }

            if (!string.IsNullOrEmpty(orgao))
            {
                query = query.Where(s => s.Orgao.ToLower().StartsWith(orgao.ToLower()));
            }

            if (!string.IsNullOrEmpty(lotacao))
            {
                query = query.Where(s => s.Lotacao.ToLower().StartsWith(lotacao.ToLower()));
            }

            return await query.Where(s => s.Ativo).ToListAsync();
        }

        // Métodos com Async no nome para consistência
        public async Task<Servidor> GetByIdAsync(int id)
        {
            return await _context.Servidores.FindAsync(id);
        }

        public async Task UpdateAsync(Servidor servidor)
        {
            _context.Servidores.Update(servidor);
            await _context.SaveChangesAsync();
        }
    }
}