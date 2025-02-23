import { Request, Response } from 'express';
import { MetaController } from '../MetaController';
import { CriarMeta } from '../../../application/use-cases/CriarMeta';
import { ObterMeta } from '../../../application/use-cases/ObterMeta';
import { AtualizarMeta } from '../../../application/use-cases/AtualizarMeta';
import { MetaRepositoryImpl } from '../../../infrastructure/repositories/MetaRepositoryImpl';

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

const metaRepo = new MetaRepositoryImpl();
const criarMeta = new CriarMeta(metaRepo);
const obterMeta = new ObterMeta(metaRepo);
const atualizarMeta = new AtualizarMeta(metaRepo);

const metaController = new MetaController(criarMeta, obterMeta, atualizarMeta);

describe('MetaController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: { id: '3', equipeId: 'equipe3', objetivo: 3 },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should create a new meta', async () => {
    jest.spyOn(metaRepo, 'criar').mockResolvedValue();

    await metaController.criar(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: '3',
      equipeId: 'equipe3',
      objetivo: 3
    });
  });
});