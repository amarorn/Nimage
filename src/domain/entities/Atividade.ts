export class Atividade {
    constructor(
        public readonly id: string,
        public vendedorId: string,
        public data: Date,
        public docinhosCoco: number
    ) {}
}