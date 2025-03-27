// src/app/components/servidor-form/servidor-form.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef  } from '@angular/core';
import { Servidor } from '../../models/servidor.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ServidorService } from '../../services/servidor.service';


@Component({
  selector: 'app-servidor-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './servidor-form.component.html',
  styleUrls: ['./servidor-form.component.css'],
})
export class ServidorFormComponent implements OnInit, OnChanges {
  @Input() modalVisible: boolean = false;
  @Input() servidorForm: Servidor = new Servidor();
  @Input() orgaos: string[] = [];
  @Output() salvar = new EventEmitter<Servidor>();
  @Output() cancelar = new EventEmitter<void>();
  lotacoesFiltradas: string[] = [];
  @Input() formErrors: any = {}; // Recebe o objeto de erros do pai

  constructor(private servidorService: ServidorService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.filterLotacoes();
  }

  ngOnChanges(changes: SimpleChanges): void {
  if (changes['servidorForm'] && !changes['servidorForm'].firstChange) {
    this.filterLotacoes();
  }
  if (changes['formErrors']) {
    this.cdr.detectChanges(); // Adicione esta linha
  }
}

  onOrgaoChange(): void {
    this.filterLotacoes();
  }

  filterLotacoes(): void {
    if (this.servidorForm.orgao) {
      this.servidorService.getLotacoesByOrgao(this.servidorForm.orgao).subscribe((data) => {
        this.lotacoesFiltradas = Array.isArray(data) ? data : [];
        if (!this.lotacoesFiltradas.includes(this.servidorForm.lotacao)) {
          this.servidorForm.lotacao = '';
        }
      });
    } else {
      this.lotacoesFiltradas = [];
      this.servidorForm.lotacao = '';
    }
  }

  onSubmit(): void {
    this.salvar.emit(this.servidorForm);
  }

  onCancelar(): void {
    this.cancelar.emit();
  }
}