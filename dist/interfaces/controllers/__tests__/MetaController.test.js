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
const MetaController_1 = require("../MetaController");
const CriarMeta_1 = require("../../../application/use-cases/CriarMeta");
const ObterMeta_1 = require("../../../application/use-cases/ObterMeta");
const AtualizarMeta_1 = require("../../../application/use-cases/AtualizarMeta");
const MetaRepositoryImpl_1 = require("../../../infrastructure/repositories/MetaRepositoryImpl");
// Mocking the repository and use cases
jest.mock('../../../infrastructure/repositories/MetaRepositoryImpl', () => {
    return {
        MetaRepositoryImpl: jest.fn().mockImplementation(() => {
            return {
                criar: jest.fn().mockResolvedValue({ id: '1', equipeId: 'equipe1', objetivo: 1 }),
                obterTodos: jest.fn().mockResolvedValue([
                    { id: '1', equipeId: 'equipe1', objetivo: 1 },
                    { id: '2', equipeId: 'equipe2', objetivo: 2 },
                ]),
                obterPorId: jest.fn().mockResolvedValue(null),
                obterPorEquipe: jest.fn().mockResolvedValue({ id: '1', equipeId: 'equipe1', objetivo: 1 }),
                atualizar: jest.fn().mockResolvedValue(null),
            };
        }),
    };
});
const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
const criarMeta = new CriarMeta_1.CriarMeta(metaRepo);
const obterMeta = new ObterMeta_1.ObterMeta(metaRepo);
const atualizarMeta = new AtualizarMeta_1.AtualizarMeta(metaRepo);
const metaController = new MetaController_1.MetaController(criarMeta, obterMeta, atualizarMeta);
describe('MetaController', () => {
    let req;
    let res;
    beforeEach(() => {
        req = {
            body: { id: '3', equipeId: 'equipe3', objetivo: 3 },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
    it('should create a new meta', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(metaRepo, 'criar').mockResolvedValue();
        yield metaController.criar(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            id: '3',
            equipeId: 'equipe3',
            objetivo: 3
        });
    }));
});
