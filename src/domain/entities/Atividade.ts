export class Atividade {
    constructor(
        public readonly id: string,
        public vendedorId: string,
        public data: Date,
        public docinhosCoco: number,
        public follow_up: number,
        public clienteId: string,
        public total_docinhos?: number
    ) {}
}