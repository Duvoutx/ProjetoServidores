import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush, // Adicionado para melhor performance
})
export class ServidorFormComponent implements OnInit, OnChanges {
  @Input() modalVisible: boolean = false;
  @Input() servidorForm: Servidor = new Servidor();
  @Input() orgaos: string[] = [];
  @Input() formErrors: any = {}; // Recebe o objeto de erros do pai
  @Output() salvar = new EventEmitter<Servidor>();
  @Output() cancelar = new EventEmitter<void>();

  lotacoesFiltradas: string[] = [];

  constructor(private servidorService: ServidorService) {}

  ngOnInit(): void {
    this.filterLotacoes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['servidorForm'] && !changes['servidorForm'].firstChange) {
      this.filterLotacoes();
    }

    if (changes['orgaos'] && !changes['orgaos'].firstChange && this.servidorForm.orgao) {
      this.filterLotacoes();
    }

    if (changes['formErrors']) {
      // Não precisa de ChangeDetectorRef com ChangeDetectionStrategy.OnPush se os erros forem um novo objeto
      // Se `formErrors` for mutado, você precisará de algo como: this.cdr.detectChanges();
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