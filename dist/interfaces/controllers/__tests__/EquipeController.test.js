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
const EquipeController_1 = require("../EquipeController");
const CriarEquipe_1 = require("../../../application/use-cases/CriarEquipe");
const ObterEquipe_1 = require("../../../application/use-cases/ObterEquipe");
const AtualizarEquipe_1 = require("../../../application/use-cases/AtualizarEquipe");
const ObterEquipeDadosFull_1 = require("../../../application/use-cases/ObterEquipeDadosFull");
const EquipeRepositoryImpl_1 = require("../../../infrastructure/repositories/EquipeRepositoryImpl");
const VendedorRepositoryImpl_1 = require("../../../infrastructure/repositories/VendedorRepositoryImpl");
const AtividadeRepositoryImpl_1 = require("../../../infrastructure/repositories/AtividadeRepositoryImpl");
const MetaRepositoryImpl_1 = require("../../../infrastructure/repositories/MetaRepositoryImpl");
const EquipeMetaService_1 = require("../../../application/services/EquipeMetaService");
// Mocking the repository and use cases
jest.mock('../../../infrastructure/repositories/EquipeRepositoryImpl', () => {
    return {
        EquipeRepositoryImpl: jest.fn().mockImplementation(() => {
            return {
                criar: jest.fn().mockResolvedValue({ id: '1', nome: 'Equipe Teste' }),
                // Mock other methods as needed
            };
        }),
    };
});
jest.mock('../../../infrastructure/repositories/VendedorRepositoryImpl', () => {
    return {
        VendedorRepositoryImpl: jest.fn().mockImplementation(() => {
            return {
                obterPorEquipeId: jest.fn(), // Mock the required method
                // Mock other methods as needed
            };
        }),
    };
});
jest.mock('../../../infrastructure/repositories/AtividadeRepositoryImpl', () => {
    return {
        AtividadeRepositoryImpl: jest.fn().mockImplementation(() => {
            return {
            // Mock methods as needed
            };
        }),
    };
});
jest.mock('../../../infrastructure/repositories/MetaRepositoryImpl', () => {
    return {
        MetaRepositoryImpl: jest.fn().mockImplementation(() => {
            return {
            // Mock methods as needed
            };
        }),
    };
});
const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
const atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
const criarEquipe = new CriarEquipe_1.CriarEquipe(equipeRepo);
const obterEquipe = new ObterEquipe_1.ObterEquipe(equipeRepo);
const atualizarEquipe = new AtualizarEquipe_1.AtualizarEquipe(equipeRepo);
const obterEquipeDadosFull = new ObterEquipeDadosFull_1.ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);
const equipeMetaService = new EquipeMetaService_1.EquipeMetaService(obterEquipeDadosFull);
const equipeController = new EquipeController_1.EquipeController(criarEquipe, obterEquipe, obterEquipeDadosFull, equipeMetaService, atualizarEquipe);
describe('EquipeController', () => {
    let req;
    let res;
    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
    it('should create a new equipe', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = { id: '1', nome: 'Equipe Teste' };
        yield equipeController.criar(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            id: '1',
            nome: 'Equipe Teste',
        }));
    }), 10000);
    // Add more tests for other methods like obterTodos, obterPorId, atualizar, etc.
});
