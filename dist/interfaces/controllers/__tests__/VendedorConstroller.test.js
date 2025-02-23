"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const vendedorController = new VendedorController_1.VendedorController(criarVendedor, obterVendedor, atualizarVendedor);
jest.mock('../../../infrastructure/repositories/VendedorRepositoryImpl', () => {
    return {
        VendedorRepositoryImpl: jest.fn().mockImplementation(() => {
            return {
                criar: jest.fn().mockResolvedValue({ id: '1', nome: 'Vendedor Teste', equipe_id: 'equipe1' }),
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
    it('should create a new vendedor', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = { id: '1', nome: 'Vendedor Teste', equipe_id: 'equipe1' };
        yield vendedorController.criar(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            id: '1',
            nome: 'Vendedor Teste',
            equipe_id: 'equipe1',
        }));
    }), 10000);
    // Add more tests for other methods like obterTodos, obterPorId, atualizar, etc.
});
