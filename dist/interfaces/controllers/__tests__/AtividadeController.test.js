"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AtividadeController_1 = require("../AtividadeController");
const CriarAtividade_1 = require("../../../application/use-cases/CriarAtividade");
const ObterAtividades_1 = require("../../../application/use-cases/ObterAtividades");
const AtualizarAtividade_1 = require("../../../application/use-cases/AtualizarAtividade");
const AtividadeRepositoryImpl_1 = require("../../../infrastructure/repositories/AtividadeRepositoryImpl");
const AtividadeService_1 = require("../../../application/services/AtividadeService");
const ObterAtividadesPorVendedorEData_1 = require("../../../application/use-cases/ObterAtividadesPorVendedorEData");
const FrequenciaVendasService_1 = require("../../../application/services/FrequenciaVendasService");
const ObterEquipeDadosFull_1 = require("../../../application/use-cases/ObterEquipeDadosFull");
const EquipeRepositoryImpl_1 = require("../../../infrastructure/repositories/EquipeRepositoryImpl");
const VendedorRepositoryImpl_1 = require("../../../infrastructure/repositories/VendedorRepositoryImpl");
const MetaRepositoryImpl_1 = require("../../../infrastructure/repositories/MetaRepositoryImpl");
// Mocking the repository and use cases
jest.mock('../../../infrastructure/repositories/AtividadeRepositoryImpl', () => {
    return {
        AtividadeRepositoryImpl: jest.fn().mockImplementation(() => {
            return {
                criar: jest.fn().mockResolvedValue({ id: '1', vendedorId: 'vendedor1', data: new Date(), docinhosCoco: 10 }),
                // Mock other methods as needed
            };
        }),
    };
});
const atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
const criarAtividade = new CriarAtividade_1.CriarAtividade(atividadeRepo);
const obterAtividades = new ObterAtividades_1.ObterAtividades(atividadeRepo);
const atualizarAtividade = new AtualizarAtividade_1.AtualizarAtividade(atividadeRepo);
// Instantiate the necessary dependencies for FrequenciaVendasService
const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
const atividadeService = new AtividadeService_1.AtividadeService(atividadeRepo, vendedorRepo, equipeRepo, metaRepo);
const obterAtividadesPorVendedorEData = new ObterAtividadesPorVendedorEData_1.ObterAtividadesPorVendedorEData(atividadeService);
const obterEquipeDadosFull = new ObterEquipeDadosFull_1.ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);
const frequenciaVendasService = new FrequenciaVendasService_1.FrequenciaVendasService(obterEquipeDadosFull);
const atividadeController = new AtividadeController_1.AtividadeController(criarAtividade, obterAtividades, atualizarAtividade, atividadeService, obterAtividadesPorVendedorEData, frequenciaVendasService);
describe('AtividadeController', () => {
    let req;
    let res;
    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
    it('should create a new atividade', async () => {
        req.body = { id: '1', vendedorId: 'vendedor1', data: new Date().toISOString(), docinhosCoco: 10 };
        await atividadeController.criar(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            id: '1',
            vendedorId: 'vendedor1',
            docinhosCoco: 10,
        }));
    }, 10000);
    // Add more tests for other methods like obterTodos, obterPorId, atualizar, etc.
});
//# sourceMappingURL=AtividadeController.test.js.map