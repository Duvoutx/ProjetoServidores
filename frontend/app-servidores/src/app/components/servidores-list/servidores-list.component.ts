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
    servidores: Servidor[] = []; // Servidores ativos
    servidoresInativos: Servidor[] = [];
    modalVisible = false;
    servidorForm: Servidor = new Servidor();
    orgaos: string[] = ['Órgão A', 'Órgão B', 'Órgão C']; // Seus órgãos
    formErrors: any = {};

    // Filtros e Paginação para Servidores Ativos
    filtroAtivosNome: string = '';
    filtroAtivosOrgao: string = '';
    filtroAtivosLotacao: string = '';
    servidoresAtivosFiltrados: Servidor[] = [];
    servidoresAtivosFiltradosPaginados: Servidor[] = [];
    pageSizeAtivos = 5; // Define o tamanho da página inicial
    pageIndexAtivos = 0;

    // Filtros e Paginação para Servidores Inativos
    filtroInativosNome: string = '';
    filtroInativosOrgao: string = '';
    filtroInativosLotacao: string = '';
    servidoresInativosFiltrados: Servidor[] = [];
    servidoresInativosFiltradosPaginados: Servidor[] = [];
    pageSizeInativos = 5; // Define o tamanho da página inicial
    pageIndexInativos = 0;

    @ViewChild('paginatorAtivos') paginatorAtivos: MatPaginator;
    @ViewChild('paginatorInativos') paginatorInativos: MatPaginator;

    constructor(
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        private servidorService: ServidorService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.carregarServidores();
        this.carregarServidoresInativos();
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
                this.filtrarServidoresAtivos(); // Aplica filtro inicial
                this.ordenarServidoresAtivos(); // Ordena a lista
                this.paginarListaAtivos();
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
                this.filtrarServidoresInativos(); // Aplica filtro inicial
                this.ordenarServidoresInativos(); // Ordena a lista
                this.paginarListaInativos();
                console.log('carregarServidoresInativos() finalizada, servidores inativos:', this.servidoresInativos.length);
            },
            (error: HttpErrorResponse) => {
                console.error('Erro ao carregar servidores inativos:', error);
                this.snackBar.open('Erro ao carregar servidores inativos.', 'Fechar', { duration: 3000 });
            }
        );
    }

    // Métodos para filtrar Servidores Ativos
    filtrarServidoresAtivos() {
        this.servidoresAtivosFiltrados = this.servidores.filter(s =>
            (!this.filtroAtivosNome || s.nome.toLowerCase().includes(this.filtroAtivosNome.toLowerCase())) &&
            (!this.filtroAtivosOrgao || s.orgao.toLowerCase().includes(this.filtroAtivosOrgao.toLowerCase())) &&
            (!this.filtroAtivosLotacao || s.lotacao.toLowerCase().includes(this.filtroAtivosLotacao.toLowerCase()))
        );
        this.ordenarServidoresAtivos(); // Ordena após filtrar
        this.paginarListaAtivos();
    }

    ordenarServidoresAtivos() {
        this.servidoresAtivosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    paginarServidoresAtivos(event: PageEvent) {
        this.pageIndexAtivos = event.pageIndex;
        this.pageSizeAtivos = event.pageSize;
        this.paginarListaAtivos();
    }

    paginarListaAtivos() {
        const startIndex = this.pageIndexAtivos * this.pageSizeAtivos;
        const endIndex = startIndex + this.pageSizeAtivos;
        this.servidoresAtivosFiltradosPaginados = this.servidoresAtivosFiltrados.slice(startIndex, endIndex);
    }

    onFiltroAtivosNomeChange(nome: string) {
        this.filtroAtivosNome = nome;
        this.filtrarServidoresAtivos();
    }

    onFiltroAtivosOrgaoChange(orgao: string) {
        this.filtroAtivosOrgao = orgao;
        this.filtrarServidoresAtivos();
    }

    onFiltroAtivosLotacaoChange(lotacao: string) {
        this.filtroAtivosLotacao = lotacao;
        this.filtrarServidoresAtivos();
    }

    buscarServidoresAtivos() {
        this.filtrarServidoresAtivos();
    }

    // Métodos para filtrar Servidores Inativos
    filtrarServidoresInativos() {
        this.servidoresInativosFiltrados = this.servidoresInativos.filter(s =>
            (!this.filtroInativosNome || s.nome.toLowerCase().includes(this.filtroInativosNome.toLowerCase())) &&
            (!this.filtroInativosOrgao || s.orgao.toLowerCase().includes(this.filtroInativosOrgao.toLowerCase())) &&
            (!this.filtroInativosLotacao || s.lotacao.toLowerCase().includes(this.filtroInativosLotacao.toLowerCase()))
        );
        this.ordenarServidoresInativos(); // Ordena após filtrar
        this.paginarListaInativos();
    }

    ordenarServidoresInativos() {
        this.servidoresInativosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    paginarServidoresInativos(event: PageEvent) {
        this.pageIndexInativos = event.pageIndex;
        this.pageSizeInativos = event.pageSize;
        this.paginarListaInativos();
    }

    paginarListaInativos() {
        const startIndex = this.pageIndexInativos * this.pageSizeInativos;
        const endIndex = startIndex + this.pageSizeInativos;
        this.servidoresInativosFiltradosPaginados = this.servidoresInativosFiltrados.slice(startIndex, endIndex);
    }

    onFiltroInativosNomeChange(nome: string) {
        this.filtroInativosNome = nome;
        this.filtrarServidoresInativos();
    }

    onFiltroInativosOrgaoChange(orgao: string) {
        this.filtroInativosOrgao = orgao;
        this.filtrarServidoresInativos();
    }

    onFiltroInativosLotacaoChange(lotacao: string) {
        this.filtroInativosLotacao = lotacao;
        this.filtrarServidoresInativos();
    }

    buscarServidoresInativos() {
        this.filtrarServidoresInativos();
    }

    abrirModalCadastro() {
        this.modalVisible = true;
        this.servidorForm = new Servidor();
    }

    editar(servidor: Servidor) {
        this.modalVisible = true;
        this.servidorForm = { ...servidor };
    }

    salvar(servidor: Servidor) {
        if (servidor.id) {
            this.servidorService.update(servidor).subscribe(
                () => {
                    this.modalVisible = false;
                    this.carregarServidores();
                    this.carregarServidoresInativos();
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
                    this.carregarServidoresInativos();
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
                this.carregarServidoresInativos();
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
                this.carregarServidoresInativos();
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
                        this.carregarServidoresInativos();
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
        // Manter a busca global, mas você pode remover se quiser apenas filtros locais
        this.servidorService.search(nome).subscribe(servidores => {
            this.servidores = servidores.filter(s => s.ativo);
            this.servidoresInativos = servidores.filter(s => !s.ativo);
            this.filtrarServidoresAtivos();
            this.filtrarServidoresInativos();
        });
    }

    onOrgaoChange(orgao: string) {
        // Manter a busca global, mas você pode remover se quiser apenas filtros locais
        this.servidorService.search(undefined, orgao).subscribe(servidores => {
            this.servidores = servidores.filter(s => s.ativo);
            this.servidoresInativos = servidores.filter(s => !s.ativo);
            this.filtrarServidoresAtivos();
            this.filtrarServidoresInativos();
        });
    }

    onLotacaoChange(lotacao: string) {
        // Manter a busca global, mas você pode remover se quiser apenas filtros locais
        this.servidorService.search(undefined, undefined, lotacao).subscribe(servidores => {
            this.servidores = servidores.filter(s => s.ativo);
            this.servidoresInativos = servidores.filter(s => !s.ativo);
            this.filtrarServidoresAtivos();
            this.filtrarServidoresInativos();
        });
    }

    buscar() {
        this.carregarServidores();
        this.carregarServidoresInativos();
    }
}