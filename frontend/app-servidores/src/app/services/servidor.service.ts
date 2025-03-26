import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Servidor } from '../models/servidor.model';

@Injectable({
  providedIn: 'root',
})
export class ServidorService {
  private apiUrl = `${environment.apiUrl}servidores`;

  constructor(private http: HttpClient) {}

  // Listar todos os servidores
  getAll(): Observable<Servidor[]> {
    return this.http.get<Servidor[]>(this.apiUrl);
  }

  // Buscar servidores por nome, órgão ou lotação
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
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this.http.post<Servidor>(this.apiUrl, servidor, { headers });
}

update(servidor: Servidor): Observable<Servidor> {
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this.http.put<Servidor>(`${this.apiUrl}/${servidor.id}`, servidor, { headers });
}

  // Inativar um servidor (exclusão lógica)
  inativar(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/inativar/${id}`, null);
  }

   getInativos(): Observable<Servidor[]> {
  return this.http.get<Servidor[]>(`${this.apiUrl}/inativos`); // Corrigido o erro na URL
}
// Método para reativar o servidor
reativar(id: number): Observable<Servidor> {
  return this.http.put<Servidor>(`${this.apiUrl}/reativar/${id}`, null);
}

// Método para excluir o servidor permanentemente
excluir(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/excluir/${id}`);
}

}
