import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Servidor } from '../models/servidor.model';

@Injectable({
  providedIn: 'root',
})
export class ServidorService {
  private apiUrl = `${environment.apiUrl}servidores`;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  // Listar todos os servidores ativos
  getAll(): Observable<Servidor[]> {
    return this.http.get<Servidor[]>(this.apiUrl);
  }

  // Listar todos os servidores inativos
  getInativos(): Observable<Servidor[]> {
    return this.http.get<Servidor[]>(`${this.apiUrl}/inativos`);
  }

  // Buscar servidores por nome, órgão ou lotação (pode ser removido se a filtragem for apenas no frontend)
  search(nome?: string, orgao?: string, lotacao?: string): Observable<Servidor[]> {
    let url = `${this.apiUrl}/buscar?`;
    if (nome) url += `nome=${nome}&`;
    if (orgao) url += `orgao=${orgao}&`;
    if (lotacao) url += `lotacao=${lotacao}`;
    url = url.endsWith('&') ? url.slice(0, -1) : url;
    return this.http.get<Servidor[]>(url);
  }

  // Método para buscar órgãos
  getOrgaos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/orgaos`);
  }

  // Método para buscar lotações por órgão
  getLotacoesByOrgao(orgao: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/lotacoes/${orgao}`);
  }

  // Cadastrar um servidor
  add(servidor: Servidor): Observable<Servidor> {
    return this.http.post<Servidor>(this.apiUrl, servidor, this.httpOptions);
  }

  // Atualizar um servidor
  update(servidor: Servidor): Observable<Servidor> {
    return this.http.put<Servidor>(`${this.apiUrl}/${servidor.id}`, servidor, this.httpOptions);
  }

  // Inativar um servidor (exclusão lógica)
  inativar(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/inativar/${id}`, null);
  }

  // Reativar um servidor
  reativar(id: number): Observable<Servidor> {
    return this.http.put<Servidor>(`${this.apiUrl}/reativar/${id}`, null);
  }

  // Excluir um servidor permanentemente
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/excluir/${id}`);
  }
}