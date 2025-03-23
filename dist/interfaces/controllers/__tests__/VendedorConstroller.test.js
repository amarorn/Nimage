"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VendedorController_1 = require("../VendedorController");
const CriarVendedor_1 = require("../../../application/use-cases/CriarVendedor");
const ObterVendedor_1 = require("../../../application/use-cases/ObterVendedor");
const AtualizarVendedor_1 = require("../../../application/use-cases/AtualizarVendedor");
const VendedorRepositoryImpl_1 = require("../../../infrastructure/repositories/VendedorRepositoryImpl");
// Mocking the repository and use cases
const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
const criarVendedor = new CriarVendedor_1.CriarVendedor(vendedorRepo);
const obterVendedor = new ObterVendedor_1.ObterVendedor(vendedorRepo);
const atualizarVendedor = new AtualizarVendedor_1.AtualizarVendedor(vendedorRepo);
// Mock do GetVendedorInsights
const getVendedorInsights = {
    execute: jest.fn().mockResolvedValue({})
};
const vendedorController = new VendedorController_1.VendedorController(criarVendedor, obterVendedor, atualizarVendedor, getVendedorInsights);
jest.mock('../../../infrastructure/repositories/VendedorRepositoryImpl', () => {
    return {
        VendedorRepositoryImpl: jest.fn().mockImplementation(() => {
            return {
                criar: jest.fn().mockResolvedValue({ id: '1', nome: 'Vendedor Teste', equipeId: 'equipe1' }),
                // Mock other methods as needed
            };
        }),
    };
});
describe('VendedorController', () => {
    let req;
    let res;
    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
    it('should create a new vendedor', async () => {
        req.body = { id: '1', nome: 'Vendedor Teste', equipeId: 'equipe1' };
        await vendedorController.criar(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            id: '1',
            nome: 'Vendedor Teste',
            equipeId: 'equipe1',
        }));
    }, 10000);
    // Add more tests for other methods like obterTodos, obterPorId, atualizar, etc.
});
//# sourceMappingURL=VendedorConstroller.test.js.map