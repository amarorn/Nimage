import { LojaRepository } from '../../domain/repositories/LojaRepository';

export class DeletarLoja {
    constructor(private lojaRepo: LojaRepository) {}

    async executar(id: string): Promise<void> {
        if (!id) {
            throw new Error('ID da loja é obrigatório');
        }
        const loja = await this.lojaRepo.obterPorId(id);
        if (!loja) {
            throw new Error('Loja não encontrada');
        }
        await this.lojaRepo.deletar(id);
    }
} 