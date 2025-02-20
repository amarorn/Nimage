export class Vendedor {
    constructor(
        public readonly id: string,
        public nome: string,
        public equipe_id: string,
        public equipeDetalhes?: { id: string; nome: string } | null
    ) {}
}