import { Request, Response } from 'express';
import { EquipeController } from '../EquipeController';
import { CriarEquipe } from '../../../application/use-cases/CriarEquipe';
import { ObterEquipe } from '../../../application/use-cases/ObterEquipe';
import { AtualizarEquipe } from '../../../application/use-cases/AtualizarEquipe';
import { ObterEquipeDadosFull } from '../../../application/use-cases/ObterEquipeDadosFull';
import { EquipeRepositoryImpl } from '../../../infrastructure/repositories/EquipeRepositoryImpl';
import { VendedorRepositoryImpl } from '../../../infrastructure/repositories/VendedorRepositoryImpl';
import { AtividadeRepositoryImpl } from '../../../infrastructure/repositories/AtividadeRepositoryImpl';
import { MetaRepositoryImpl } from '../../../infrastructure/repositories/MetaRepositoryImpl';
import { EquipeMetaService } from '../../../application/services/EquipeMetaService';

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

const equipeRepo = new EquipeRepositoryImpl();
const vendedorRepo = new VendedorRepositoryImpl();
const atividadeRepo = new AtividadeRepositoryImpl();
const metaRepo = new MetaRepositoryImpl();
const criarEquipe = new CriarEquipe(equipeRepo);
const obterEquipe = new ObterEquipe(equipeRepo);
const atualizarEquipe = new AtualizarEquipe(equipeRepo);
const obterEquipeDadosFull = new ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);

const equipeMetaService = new EquipeMetaService(obterEquipeDadosFull);

const equipeController = new EquipeController(criarEquipe, obterEquipe, obterEquipeDadosFull, equipeMetaService, atualizarEquipe);

describe('EquipeController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {    
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should create a new equipe', async () => {
    req.body = { id: '1', nome: 'Equipe Teste' };

    await equipeController.criar(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      id: '1',
      nome: 'Equipe Teste',
    }));
  }, 10000);

  // Add more tests for other methods like obterTodos, obterPorId, atualizar, etc.
}); 