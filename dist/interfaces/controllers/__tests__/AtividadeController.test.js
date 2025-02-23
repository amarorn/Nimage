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
const AtividadeController_1 = require("../AtividadeController");
const CriarAtividade_1 = require("../../../application/use-cases/CriarAtividade");
const ObterAtividades_1 = require("../../../application/use-cases/ObterAtividades");
const AtualizarAtividade_1 = require("../../../application/use-cases/AtualizarAtividade");
const AtividadeRepositoryImpl_1 = require("../../../infrastructure/repositories/AtividadeRepositoryImpl");
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
const atividadeController = new AtividadeController_1.AtividadeController(criarAtividade, obterAtividades, atualizarAtividade);
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
    it('should create a new atividade', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = { id: '1', vendedorId: 'vendedor1', data: new Date().toISOString(), docinhosCoco: 10 };
        yield atividadeController.criar(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            id: '1',
            vendedorId: 'vendedor1',
            docinhosCoco: 10,
        }));
    }), 10000);
    // Add more tests for other methods like obterTodos, obterPorId, atualizar, etc.
});
