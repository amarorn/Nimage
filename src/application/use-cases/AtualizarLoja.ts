import { Loja } from '../../domain/entities/Loja';
import { LojaRepository } from '../../domain/repositories/LojaRepository';

interface AtualizarLojaDTO {
    nome?: string;
    cnpj?: string;
    telefone?: string;
    montadoraId?: string;
}

export class AtualizarLoja {
    constructor(private lojaRepo: LojaRepository) {}

    async executar(id: string, dados: AtualizarLojaDTO): Promise<Loja | null> {
        if (!id) {
            throw new Error('ID da loja é obrigatório');
        }
        // Verifica se a loja existe
        const lojaExistente = await this.lojaRepo.obterPorId(id);
        if (!lojaExistente) {
            throw new Error('Loja não encontrada');
        }
        return await this.lojaRepo.atualizar(id, dados);
    }
} 