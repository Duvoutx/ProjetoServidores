import { Component, OnInit } from '@angular/core';
import { ServidorService } from '../../services/servidor.service';
import { Servidor } from '../../models/servidor.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialogContent } from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-servidores-list',
  standalone: true,
  templateUrl: './servidores-list.component.html',
  styleUrls: ['./servidores-list.component.css'],
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    MatOptionModule
  ],
})
export class ServidoresListComponent implements OnInit {
  servidoresInativos: Servidor[] = [];
  servidores: Servidor[] = [];
  displayedColumns: string[] = ['id', 'nome', 'telefone', 'email', 'orgao', 'lotacao', 'sala', 'ativo'];
  nome: string = '';
  orgao: string = '';
  lotacao: string = '';
  modalVisible: boolean = false;
  servidorForm: Servidor = new Servidor();
  orgaos: string[] = [];
  lotacoesFiltradas: string[] = [];

  constructor(private servidorService: ServidorService) {}

  ngOnInit(): void {
    this.atualizarLista(); // Atualiza a lista no carregamento
    this.getOrgaos();
  }

  atualizarLista(): void {
    // Buscar servidores ativos
    this.servidorService.getAll().subscribe((data) => {
      // Certifique-se de que 'data' seja um array
      this.servidores = Array.isArray(data) ? data : [];
    });

    // Buscar servidores inativos
    this.servidorService.getInativos().subscribe((data) => {
      // Certifique-se de que 'data' seja um array
      this.servidoresInativos = Array.isArray(data) ? data : [];
    });
  }

  getOrgaos(): void {
    this.servidorService.getOrgaos().subscribe((data) => {
      // Certifique-se de que 'data' seja um array
      this.orgaos = Array.isArray(data) ? data : [];
    });
  }

  onOrgaoChange(): void {
    if (this.servidorForm.orgao) {
      this.servidorService.getLotacoesByOrgao(this.servidorForm.orgao).subscribe((data) => {
        // Certifique-se de que 'data' seja um array
        this.lotacoesFiltradas = Array.isArray(data) ? data : [];
        if (!this.lotacoesFiltradas.includes(this.servidorForm.lotacao)) {
          this.servidorForm.lotacao = '';
        }
      });
    } else {
      this.lotacoesFiltradas = [];
    }
  }

  inativar(id: number): void {
    this.servidorService.inativar(id).subscribe(() => {
      this.atualizarLista(); // Atualiza após inativação
    });
  }

  reativar(id: number): void {
    this.servidorService.reativar(id).subscribe(() => {
      this.atualizarLista(); // Atualiza após reativação
    });
  }

  excluir(id: number): void {
    if (confirm('Tem certeza que deseja excluir este servidor permanentemente?')) {
      this.servidorService.excluir(id).subscribe(() => {
        this.atualizarLista(); // Atualiza após exclusão
      });
    }
  }

  buscar(): void {
    this.servidorService.search(this.nome, this.orgao, this.lotacao).subscribe((data) => {
      // Certifique-se de que 'data' seja um array
      this.servidores = Array.isArray(data) ? data : [];
    });
  }

  editar(servidor: Servidor): void {
    this.servidorForm = { ...servidor };
    this.modalVisible = true;
    this.onOrgaoChange();
  }

  salvar(): void {
    if (this.servidorForm.id) {
      this.servidorService.update(this.servidorForm).subscribe(() => {
        this.atualizarLista();
        this.modalVisible = false;
      });
    } else {
      this.servidorService.add(this.servidorForm).subscribe(() => {
        this.atualizarLista();
        this.modalVisible = false;
      });
    }
  }

  cancelar(): void {
    this.modalVisible = false;
  }
}
