export class Equipe {
    constructor(
        public readonly id: string,
        public nome: string,
        public pdv: string,
        public cidade: string,
        public estado: string,
        public lojaId: string,
        public gerenteNome?: string,
        public gerenteTelefone?: string,
        public capitaoNome?: string,
        public capitaoTelefone?: string,
        public temaId?: string
    ) {}
}