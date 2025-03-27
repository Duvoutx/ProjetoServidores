import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-servidor-search',
  standalone: true,
  imports: [FormsModule, CommonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './servidor-search.component.html',
  styleUrls: ['./servidor-search.component.css'],
})
export class ServidorSearchComponent {
  @Input() nome: string = '';
  @Input() orgao: string = '';
  @Input() lotacao: string = '';
  @Output() nomeChange = new EventEmitter<string>();
  @Output() orgaoChange = new EventEmitter<string>();
  @Output() lotacaoChange = new EventEmitter<string>();

  onNomeChange(newValue: string) {
    this.nomeChange.emit(newValue);
  }

  onOrgaoChange(newValue: string) {
    this.orgaoChange.emit(newValue);
  }

  onLotacaoChange(newValue: string) {
    this.lotacaoChange.emit(newValue);
  }
}