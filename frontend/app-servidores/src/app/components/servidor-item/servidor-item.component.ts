// src/app/components/servidor-item/servidor-item.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Servidor } from '../../models/servidor.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip'; // Importe o MatTooltipModule

@Component({
  selector: 'app-servidor-item',
  standalone: true,
  imports: [CommonModule, MatButtonModule,MatIconModule, MatChipsModule,MatTooltipModule] ,
  templateUrl: './servidor-item.component.html',
  styleUrls: ['./servidor-item.component.css']
})
export class ServidorItemComponent {
@Input() servidor!: Servidor;
  @Output() editar = new EventEmitter<Servidor>();
  @Output() inativar = new EventEmitter<number>();
  @Output() reativar = new EventEmitter<number>();
  @Output() excluir = new EventEmitter<number>();

  isInativo: boolean = false;

  ngOnInit(): void {
    this.isInativo = !this.servidor.ativo;
  }

  onEditar() {
    this.editar.emit(this.servidor);
  }

  onInativar() {
    this.inativar.emit(this.servidor.id);
  }

  onReativar() {
    this.reativar.emit(this.servidor.id);
  }

  onExcluir() {
    this.excluir.emit(this.servidor.id);
  }
}