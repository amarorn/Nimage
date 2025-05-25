export class Loja {
    constructor(
        public readonly id: string,
        public nome: string,
        public cnpj: string,
        public telefone: string,
        public montadoraId: string
    ) {}
} 