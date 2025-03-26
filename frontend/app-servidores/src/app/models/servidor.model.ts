export class Servidor {
  constructor(
    public id: number = 0,
    public nome: string = '',
    public telefone: string = '',
    public email: string = '',
    public orgao: string = '',
    public lotacao: string = '',
    public sala: string = '',
    public ativo: boolean = true
  ) {}
}