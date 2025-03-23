export class Vendedor {
    constructor(
        public id: string,
        public nome: string,
        public equipeId: string,
        public email: string,
        public telefone: string,
        public meta: number,
        public cargo: string
    ) {}
}