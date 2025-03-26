import { Component, OnInit } from '@angular/core';
import { ServidorService } from '../../services/servidor.service';
import { Servidor } from '../../models/servidor.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-servidores-list',
  standalone: true,
  templateUrl: './servidores-list.component.html',
  styleUrls: ['./servidores-list.component.css'],
  imports: [FormsModule, CommonModule, HttpClientModule],  // Certifique-se de importar o CommonModule aqui
})
export class ServidoresListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'telefone', 'email', 'orgao', 'lotacao', 'sala', 'ativo'];
  servidores: Servidor[] = [];
  nome: string = '';
  orgao: string = '';
  lotacao: string = '';
  modalVisible: boolean = false;
  servidorForm: Servidor = new Servidor();  // Formulário de servidor vazio para edição/cadastro

  constructor(private servidorService: ServidorService) {}

  ngOnInit(): void {
    this.getServidores();
  }

  getServidores(): void {
    this.servidorService.getAll().subscribe((data) => {
      this.servidores = data;
    });
  }

  buscar(): void {
    this.servidorService.search(this.nome, this.orgao, this.lotacao).subscribe((data) => {
      this.servidores = data;
    });
  }

  // Exibe o formulário de cadastro ou edição
  editar(servidor: Servidor): void {
    this.servidorForm = { ...servidor };  // Preenche o formulário com os dados do servidor
    this.modalVisible = true;
  }

  // Salva um servidor (cadastro ou atualização)
  salvar(): void {
  if (this.servidorForm.id) {
    this.servidorService.update(this.servidorForm).subscribe(
      () => {
        this.getServidores();
        this.modalVisible = false;
      },
      (error) => {
        console.error('Erro ao atualizar servidor', error);
        alert('Erro ao atualizar servidor.');
      }
    );
  } else {
    this.servidorService.add(this.servidorForm).subscribe(
      () => {
        this.getServidores();
        this.modalVisible = false;
      },
      (error) => {
        console.error('Erro ao adicionar servidor', error);
        alert('Erro ao adicionar servidor.');
      }
    );
  }
}

  // Inativar servidor
  inativar(id: number): void {
    this.servidorService.inativar(id).subscribe(() => {
      this.getServidores();
    });
  }

  // Cancelar edição/cadastro
  cancelar(): void {
    this.modalVisible = false;
  }
}
