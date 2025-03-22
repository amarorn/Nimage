"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaController = void 0;
class MetaController {
    constructor(criarMeta, obterMeta, atualizarMeta, obterEquipePorId) {
        this.criarMeta = criarMeta;
        this.obterMeta = obterMeta;
        this.atualizarMeta = atualizarMeta;
        this.obterEquipePorId = obterEquipePorId;
    }
    async criar(req, res) {
        try {
            if (!req.body) {
                return res.status(400).json({ erro: 'Body da requisição está vazio' });
            }
            const { id, equipeId, objetivo, mes } = req.body;
            // Validação dos campos obrigatórios
            if (!id || !equipeId || objetivo === undefined || !mes) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        id: id ? 'presente' : 'ausente',
                        equipeId: equipeId ? 'presente' : 'ausente',
                        objetivo: objetivo !== undefined ? 'presente' : 'ausente',
                        mes: mes ? 'presente' : 'ausente'
                    }
                });
            }
            // Validação do mês
            const mesNum = parseInt(mes);
            if (isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
                return res.status(400).json({
                    erro: 'Mês inválido',
                    detalhes: { mes: mesNum }
                });
            }
            // Pega o ano atual
            const anoAtual = new Date().getFullYear();
            // Cria a data com o primeiro dia do mês
            const data = new Date(anoAtual, mesNum - 1, 1);
            const meta = await this.criarMeta.executar({
                id,
                equipeId,
                objetivo,
                data
            });
            return res.status(201).json(meta);
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao criar meta',
                mensagem: erro.message
            });
        }
    }
    async obterTodos(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const metas = await this.obterMeta.executar(skip, limit);
            const metasComEquipe = await Promise.all(metas.map(async (meta) => {
                const equipe = await this.obterEquipePorId.executar(meta.equipeId);
                return {
                    id: meta.id,
                    equipeId: meta.equipeId,
                    equipeNome: equipe ? equipe.nome : 'Nome não encontrado',
                    objetivo: meta.objetivo,
                    data: meta.data,
                    mes: meta.data.getMonth() + 1,
                    ano: meta.data.getFullYear()
                };
            }));
            const respostaPersonalizada = {
                pagina: page,
                statuscode: 200,
                limite: limit,
                total: metas.length,
                metas: metasComEquipe
            };
            return respostaPersonalizada;
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao obter metas',
                mensagem: erro.message
            });
        }
    }
    async obterPorId(req, res) {
        try {
            const { id } = req.params;
            const meta = await this.obterMeta.executarPorId(id);
            if (!meta) {
                return res.status(404).json({ erro: 'Meta não encontrada' });
            }
            return res.status(200).json({
                id: meta.id,
                equipeId: meta.equipeId,
                objetivo: meta.objetivo,
                data: meta.data
            });
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao obter meta',
                mensagem: erro.message
            });
        }
    }
    async obterPorEquipe(req, res) {
        try {
            const { equipeId } = req.params;
            const meta = await this.obterMeta.executarPorEquipe(equipeId);
            if (!meta) {
                return res.status(404).json({ erro: 'Meta não encontrada para esta equipe' });
            }
            return res.status(200).json({
                status: 'success',
                data: {
                    id: meta.id,
                    equipeId: meta.equipeId,
                    objetivo: meta.objetivo,
                    data: meta.data
                }
            });
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao obter meta por equipe',
                mensagem: erro.message
            });
        }
    }
    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { equipeId, objetivo, mes } = req.body;
            if (!equipeId || objetivo === undefined || !mes) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        equipeId: equipeId ? 'presente' : 'ausente',
                        objetivo: objetivo !== undefined ? 'presente' : 'ausente',
                        mes: mes ? 'presente' : 'ausente'
                    }
                });
            }
            // Validação do mês
            const mesNum = parseInt(mes);
            if (isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
                return res.status(400).json({
                    erro: 'Mês inválido',
                    detalhes: { mes: mesNum }
                });
            }
            // Pega o ano atual
            const anoAtual = new Date().getFullYear();
            const data = new Date(anoAtual, mesNum - 1, 1);
            const metaAtualizada = await this.atualizarMeta.executar(id, {
                equipeId,
                objetivo,
                data
            });
            return res.status(200).json(metaAtualizada);
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao atualizar meta',
                mensagem: erro.message
            });
        }
    }
}
exports.MetaController = MetaController;
//# sourceMappingURL=MetaController.js.map