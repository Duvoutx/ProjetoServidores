// src/app/components/servidores-list/servidores-list.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ServidorService } from '../../services/servidor.service'; // Importe o ServidorService
import { Servidor } from '../../models/servidor.model';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http'; // Importe HttpErrorResponse
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table'; // Se optar por tabela
import { MatSortModule } from '@angular/material/sort';   // Se optar por ordenação em tabela
import { MatPaginatorModule } from '@angular/material/paginator'; // Se optar por paginação
import { MatFormFieldModule } from '@angular/material/form-field'; // Para form fields do Material
import { MatInputModule } from '@angular/material/input';     // Para inputs do Material
import { MatSelectModule } from '@angular/material/select';   // Para selects do Material
import { MatDialogModule } from '@angular/material/dialog';   // Para diálogos de confirmação
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component'; // Já estava aqui


import { ServidorItemComponent } from '../servidor-item/servidor-item.component';
import { ServidorFormComponent } from '../servidor-form/servidor-form.component';
import { ServidorSearchComponent } from '../servidor-search/servidor-search.component';

@Component({
  selector: 'app-servidores-list',
  standalone: true,
  templateUrl: './servidores-list.component.html',
  styleUrls: ['./servidores-list.component.css'],
  imports: [
    CommonModule,
    MatButtonModule,
    ServidorItemComponent,
    ServidorFormComponent,
    ServidorSearchComponent,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
  ],
})
export class ServidoresListComponent implements OnInit {
  allServidores: Servidor[] = [];
  servidores: Servidor[] = []; // Agora tipado como Servidor[]
  servidoresInativos: Servidor[] = []; // Agora tipado como Servidor[]
  modalVisible = false;
  servidorForm: Servidor = new Servidor(); // Agora tipado como Servidor
  orgaos: string[] = ['Órgão A', 'Órgão B', 'Órgão C']; // Seus órgãos (pode vir do backend também)
  formErrors: any = {};
  filtroStatus: string = ''; // Adicione esta linha

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private servidorService: ServidorService, // Injete o ServidorService,
    private changeDetectorRef: ChangeDetectorRef // Adicione esta linha
  ) { }

  ngOnInit(): void {
  this.carregarServidores();
  this.carregarServidoresInativos(); // Carrega os servidores inativos na inicialização
  this.carregarOrgaos();
}

  carregarOrgaos() {
    this.servidorService.getOrgaos().subscribe(
      (orgaos) => {
        this.orgaos = orgaos;
      },
      (error) => {
        console.error('Erro ao carregar órgãos:', error);
        this.snackBar.open('Erro ao carregar órgãos.', 'Fechar', { duration: 3000 });
      }
    );
  }

  carregarServidores() {
  console.log('carregarServidores() chamada');
  this.servidorService.getAll().subscribe(
    (servidores) => {
      this.servidores = servidores;
      console.log('carregarServidores() finalizada, servidores ativos:', this.servidores.length);
    },
    (error: HttpErrorResponse) => {
      console.error('Erro ao carregar servidores ativos:', error);
      this.snackBar.open('Erro ao carregar servidores ativos.', 'Fechar', { duration: 3000 });
    }
  );
}
carregarServidoresInativos() {
  console.log('carregarServidoresInativos() chamada');
  this.servidorService.getInativos().subscribe(
    (servidoresInativos) => {
      this.servidoresInativos = servidoresInativos;
      console.log('carregarServidoresInativos() finalizada, servidores inativos:', this.servidoresInativos.length);
    },
    (error: HttpErrorResponse) => {
      console.error('Erro ao carregar servidores inativos:', error);
      this.snackBar.open('Erro ao carregar servidores inativos.', 'Fechar', { duration: 3000 });
    }
  );
}

 filtrarServidores() {
  if (this.filtroStatus === 'ativo') {
    this.carregarServidores();
  } else if (this.filtroStatus === 'inativo') {
    this.carregarServidoresInativos();
  } else {
    this.carregarServidores();
    this.carregarServidoresInativos();
  }
  console.log('filtrarServidores() finalizada, filtroStatus:', this.filtroStatus, 'ativos:', this.servidores.length, 'inativos:', this.servidoresInativos.length);
}

  abrirModalCadastro() {
    this.modalVisible = true;
    this.servidorForm = new Servidor(); // Limpa o formulário para novo cadastro
  }

  editar(servidor: Servidor) {
    this.modalVisible = true;
    this.servidorForm = { ...servidor }; // Preenche o formulário com os dados do servidor
  }

  salvar(servidor: Servidor) {
    if (servidor.id) {
      this.servidorService.update(servidor).subscribe(
        () => {
          this.modalVisible = false;
          this.carregarServidores();
          this.snackBar.open('Servidor atualizado com sucesso!', 'Fechar', { duration: 3000 });
        },
        (error) => {
          console.error('Erro ao atualizar servidor:', error);
          this.snackBar.open('Erro ao atualizar servidor.', 'Fechar', { duration: 3000 });
        }
      );
    } else {
      this.servidorService.add(servidor).subscribe(
        () => {
          this.modalVisible = false;
          this.carregarServidores();
          this.snackBar.open('Servidor salvo com sucesso!', 'Fechar', { duration: 3000 });
        },
        (error) => {
          console.error('Erro ao salvar servidor:', error);
          this.snackBar.open('Erro ao salvar servidor.', 'Fechar', { duration: 3000 });
        }
      );
    }
  }

  inativar(id: number) {
    this.servidorService.inativar(id).subscribe(
      () => {
        this.carregarServidores();
        this.snackBar.open('Servidor inativado com sucesso!', 'Fechar', { duration: 3000 });
      },
      (error) => {
        console.error('Erro ao inativar servidor:', error);
        this.snackBar.open('Erro ao inativar servidor.', 'Fechar', { duration: 3000 });
      }
    );
  }

  reativar(id: number) {
    this.servidorService.reativar(id).subscribe(
      () => {
        this.carregarServidores();
        this.snackBar.open('Servidor reativado com sucesso!', 'Fechar', { duration: 3000 });
      },
      (error) => {
        console.error('Erro ao reativar servidor:', error);
        this.snackBar.open('Erro ao reativar servidor.', 'Fechar', { duration: 3000 });
      }
    );
  }

  excluir(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmar Exclusão', message: 'Tem certeza que deseja excluir este servidor?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servidorService.excluir(id).subscribe(
          () => {
            this.carregarServidores();
            this.changeDetectorRef.detectChanges();
            this.snackBar.open('Servidor excluído com sucesso!', 'Fechar', { duration: 3000 });
          },
          (error) => {
            console.error('Erro ao excluir servidor:', error);
            this.snackBar.open('Erro ao excluir servidor.', 'Fechar', { duration: 3000 });
          }
        );
      }
    });
  }
  cancelar() {
    this.modalVisible = false;
  }
  onNomeChange(nome: string) {
    console.log('Busca por nome:', nome);
    this.servidorService.search(nome).subscribe(servidores => {
      this.servidores = servidores.filter(s => s.ativo);
      this.servidoresInativos = servidores.filter(s => !s.ativo);
    });
  }

  onOrgaoChange(orgao: string) {
    console.log('Busca por órgão:', orgao);
    this.servidorService.search(undefined, orgao).subscribe(servidores => {
      this.servidores = servidores.filter(s => s.ativo);
      this.servidoresInativos = servidores.filter(s => !s.ativo);
    });
  }

  onLotacaoChange(lotacao: string) {
    console.log('Busca por lotação:', lotacao);
    this.servidorService.search(undefined, undefined, lotacao).subscribe(servidores => {
      this.servidores = servidores.filter(s => s.ativo);
      this.servidoresInativos = servidores.filter(s => !s.ativo);
    });
  }

  buscar() {
  this.carregarServidores();
  this.carregarServidoresInativos();
}
}