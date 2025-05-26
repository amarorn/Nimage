export class Cliente {
    constructor(
        public readonly id: string,
        public nome: string,
        public email: string,
        public telefone: string,
        public vendedorId: string = ''
    ) {}
} 