import { Request, Response } from 'express';
import { AtividadeController } from '../AtividadeController';
import { CriarAtividade } from '../../../application/use-cases/CriarAtividade';
import { ObterAtividades } from '../../../application/use-cases/ObterAtividades';
import { AtualizarAtividade } from '../../../application/use-cases/AtualizarAtividade';
import { AtividadeRepositoryImpl } from '../../../infrastructure/repositories/AtividadeRepositoryImpl';

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

const atividadeRepo = new AtividadeRepositoryImpl();
const criarAtividade = new CriarAtividade(atividadeRepo);
const obterAtividades = new ObterAtividades(atividadeRepo);
const atualizarAtividade = new AtualizarAtividade(atividadeRepo);

const atividadeController = new AtividadeController(criarAtividade, obterAtividades, atualizarAtividade);

describe('AtividadeController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should create a new atividade', async () => {
    req.body = { id: '1', vendedorId: 'vendedor1', data: new Date().toISOString(), docinhosCoco: 10 };

    await atividadeController.criar(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      id: '1',
      vendedorId: 'vendedor1',
      docinhosCoco: 10,
    }));
  }, 10000);

  // Add more tests for other methods like obterTodos, obterPorId, atualizar, etc.
});