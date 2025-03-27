import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ServidorService } from '../../services/servidor.service';
import { Servidor } from '../../models/servidor.model';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDividerModule } from '@angular/material/divider';

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
        MatCardModule,
        MatDividerModule,
        MatToolbarModule
    ],
})
export class ServidoresListComponent implements OnInit {
  allServidores: Servidor[] = [];
  servidoresAtivos: Servidor[] = [];
  servidoresInativos: Servidor[] = [];
  modalVisible = false;
  servidorForm: Servidor = new Servidor();
  orgaos: string[] = [];
  formErrors: any = {};

  // Filtros e Paginação para Servidores Ativos
  filtroAtivosNome: string = '';
  filtroAtivosOrgao: string = '';
  filtroAtivosLotacao: string = '';
  servidoresAtivosFiltrados: Servidor[] = [];
  servidoresAtivosFiltradosPaginados: Servidor[] = [];
  pageSizeAtivos = 5;
  pageIndexAtivos = 0;

  // Filtros e Paginação para Servidores Inativos
  filtroInativosNome: string = '';
  filtroInativosOrgao: string = '';
  filtroInativosLotacao: string = '';
  servidoresInativosFiltrados: Servidor[] = [];
  servidoresInativosFiltradosPaginados: Servidor[] = [];
  pageSizeInativos = 5;
  pageIndexInativos = 0;

  @ViewChild('paginatorAtivos') paginatorAtivos!: MatPaginator;
  @ViewChild('paginatorInativos') paginatorInativos!: MatPaginator;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private servidorService: ServidorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarOrgaos();
    this.carregarServidoresAtivos();
    this.carregarServidoresInativos();
  }

  // Carregamento de Dados
  private carregarOrgaos(): void {
    this.servidorService.getOrgaos().subscribe({
      next: (orgaos) => (this.orgaos = orgaos),
      error: (error) => {
        console.error('Erro ao carregar órgãos:', error);
        this.snackBar.open('Erro ao carregar órgãos.', 'Fechar', { duration: 3000 });
      },
    });
  }

  private carregarServidoresAtivos(): void {
    this.servidorService.getAll().subscribe({
      next: (servidores) => {
        this.servidoresAtivos = servidores.filter((s) => s.ativo);
        this.filtrarServidoresAtivos();
        this.ordenarServidoresAtivos();
        this.paginarListaAtivos();
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar servidores ativos:', error);
        this.snackBar.open('Erro ao carregar servidores ativos.', 'Fechar', { duration: 3000 });
        this.cdr.detectChanges();
      },
    });
  }

  private carregarServidoresInativos(): void {
    this.servidorService.getInativos().subscribe({
      next: (servidoresInativos) => {
        this.servidoresInativos = servidoresInativos;
        this.filtrarServidoresInativos();
        this.ordenarServidoresInativos();
        this.paginarListaInativos();
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar servidores inativos:', error);
        this.snackBar.open('Erro ao carregar servidores inativos.', 'Fechar', { duration: 3000 });
        this.cdr.detectChanges();
      },
    });
  }

  // Métodos para filtrar Servidores Ativos
  filtrarServidoresAtivos(): void {
    this.servidoresAtivosFiltrados = this.servidoresAtivos.filter((s) =>
      (!this.filtroAtivosNome || s.nome.toLowerCase().includes(this.filtroAtivosNome.toLowerCase())) &&
      (!this.filtroAtivosOrgao || s.orgao.toLowerCase().includes(this.filtroAtivosOrgao.toLowerCase())) &&
      (!this.filtroAtivosLotacao || s.lotacao.toLowerCase().includes(this.filtroAtivosLotacao.toLowerCase()))
    );
    this.ordenarServidoresAtivos();
    this.paginarListaAtivos();
  }

  private ordenarServidoresAtivos(): void {
    this.servidoresAtivosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  paginarServidoresAtivos(event: PageEvent): void {
    this.pageIndexAtivos = event.pageIndex;
    this.pageSizeAtivos = event.pageSize;
    this.paginarListaAtivos();
  }

  private paginarListaAtivos(): void {
    const startIndex = this.pageIndexAtivos * this.pageSizeAtivos;
    const endIndex = startIndex + this.pageSizeAtivos;
    this.servidoresAtivosFiltradosPaginados = this.servidoresAtivosFiltrados.slice(startIndex, endIndex);
  }

  // Métodos para filtrar Servidores Inativos
  filtrarServidoresInativos(): void {
    this.servidoresInativosFiltrados = this.servidoresInativos.filter((s) =>
      (!this.filtroInativosNome || s.nome.toLowerCase().includes(this.filtroInativosNome.toLowerCase())) &&
      (!this.filtroInativosOrgao || s.orgao.toLowerCase().includes(this.filtroInativosOrgao.toLowerCase())) &&
      (!this.filtroInativosLotacao || s.lotacao.toLowerCase().includes(this.filtroInativosLotacao.toLowerCase()))
    );
    this.ordenarServidoresInativos();
    this.paginarListaInativos();
  }

  private ordenarServidoresInativos(): void {
    this.servidoresInativosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  paginarServidoresInativos(event: PageEvent): void {
    this.pageIndexInativos = event.pageIndex;
    this.pageSizeInativos = event.pageSize;
    this.paginarListaInativos();
  }

  private paginarListaInativos(): void {
    const startIndex = this.pageIndexInativos * this.pageSizeInativos;
    const endIndex = startIndex + this.pageSizeInativos;
    this.servidoresInativosFiltradosPaginados = this.servidoresInativosFiltrados.slice(startIndex, endIndex);
  }

  // Métodos de Manipulação do Modal e Formulário
  abrirModalCadastro(): void {
    this.modalVisible = true;
    this.servidorForm = new Servidor();
    this.formErrors = {};
  }

  editar(servidor: Servidor): void {
    this.modalVisible = true;
    this.servidorForm = { ...servidor };
    this.formErrors = {};
  }

  onSubmit(): void {
    this.salvar(this.servidorForm);
  }

  cancelar(): void {
    this.modalVisible = false;
  }

  salvar(servidor: Servidor): void {
    this.formErrors = {};
    const operation = servidor.id ? this.servidorService.update(servidor) : this.servidorService.add(servidor);

    operation.subscribe({
      next: () => this.handleSaveSuccess(),
      error: (error: HttpErrorResponse) => this.handleSaveError(error),
    });
  }

  private handleSaveSuccess(): void {
    this.modalVisible = false;
    this.carregarServidoresAtivos();
    this.carregarServidoresInativos();
    this.snackBar.open(`Servidor ${this.servidorForm.id ? 'atualizado' : 'salvo'} com sucesso!`, 'Fechar', {
      duration: 3000,
    });
  }

  private handleSaveError(error: HttpErrorResponse): void {
    console.error('Erro ao salvar/atualizar servidor:', error);
    if (error.status === 400 && error.error?.errors) {
      this.formErrors = error.error.errors;
    } else if (error.error) {
      this.snackBar.open(error.error, 'Fechar', { duration: 3000 });
    } else {
      this.snackBar.open(`Erro ao ${this.servidorForm.id ? 'atualizar' : 'salvar'} servidor.`, 'Fechar', {
        duration: 3000,
      });
    }
    this.cdr.detectChanges();
  }

  // Métodos de Ação do Servidor
  inativar(id: number): void {
    this.servidorService.inativar(id).subscribe({
      next: () => this.handleStatusChange('inativado'),
      error: (error) => this.handleStatusChangeError('inativar', error),
    });
  }

  reativar(id: number): void {
    this.servidorService.reativar(id).subscribe({
      next: () => this.handleStatusChange('reativado'),
      error: (error) => this.handleStatusChangeError('reativar', error),
    });
  }

  excluir(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmar Exclusão', message: 'Tem certeza que deseja excluir este servidor?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.servidorService.excluir(id).subscribe({
          next: () => this.handleStatusChange('excluído'),
          error: (error) => this.handleStatusChangeError('excluir', error),
        });
      }
    });
  }

  private handleStatusChange(operation: string): void {
    this.carregarServidoresAtivos();
    this.carregarServidoresInativos();
    this.snackBar.open(`Servidor ${operation} com sucesso!`, 'Fechar', { duration: 3000 });
    this.cdr.detectChanges();
  }

  private handleStatusChangeError(operation: string, error: any): void {
    console.error(`Erro ao ${operation} servidor:`, error);
    this.snackBar.open(`Erro ao ${operation} servidor.`, 'Fechar', { duration: 3000 });
  }

  // Métodos de Busca (via componente de busca) - Removidos para usar filtragem local
}