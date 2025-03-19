export class Equipe {
    constructor(
        public readonly id: string,
        public nome: string,
        public nomepdv: string,
        public cidade: string,
        public estado: string,
        public gerente: string,
        public contato_gerente: string,
        public capitao: string,
        public contato_capitao: string
    ) {}
}