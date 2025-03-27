import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-servidor-search',
  standalone: true,
  imports: [FormsModule, CommonModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './servidor-search.component.html',
  styleUrls: ['./servidor-search.component.css'],
})
export class ServidorSearchComponent {
  @Input() nome: string = '';
  @Input() orgao: string = '';
  @Input() lotacao: string = '';
  @Output() buscar = new EventEmitter<void>();
  @Output() nomeChange = new EventEmitter<string>();
  @Output() orgaoChange = new EventEmitter<string>();
  @Output() lotacaoChange = new EventEmitter<string>();

  onNomeChange(newValue: string) { // Altere o tipo do parâmetro para string
    this.nome = newValue;
    this.nomeChange.emit(this.nome);
  }

  onOrgaoChange(newValue: string) { // Altere o tipo do parâmetro para string
    this.orgao = newValue;
    this.orgaoChange.emit(this.orgao);
  }

  onLotacaoChange(newValue: string) { // Altere o tipo do parâmetro para string
    this.lotacao = newValue;
    this.lotacaoChange.emit(this.lotacao);
  }

  onBuscarClick() {
    this.buscar.emit();
  }
}