import { Request, Response } from 'express';
import { VendedorController } from '../VendedorController';
import { CriarVendedor } from '../../../application/use-cases/CriarVendedor';
import { ObterVendedor } from '../../../application/use-cases/ObterVendedor';
import { AtualizarVendedor } from '../../../application/use-cases/AtualizarVendedor';
import { VendedorRepositoryImpl } from '../../../infrastructure/repositories/VendedorRepositoryImpl';

// Mocking the repository and use cases
const vendedorRepo = new VendedorRepositoryImpl();
const criarVendedor = new CriarVendedor(vendedorRepo);
const obterVendedor = new ObterVendedor(vendedorRepo);
const atualizarVendedor = new AtualizarVendedor(vendedorRepo);

const vendedorController = new VendedorController(criarVendedor, obterVendedor, atualizarVendedor);

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
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should create a new vendedor', async () => {
    req.body = { id: '1', nome: 'Vendedor Teste', equipe_id: 'equipe1' };

    await vendedorController.criar(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      id: '1',
      nome: 'Vendedor Teste',
      equipe_id: 'equipe1',
    }));
  }, 10000);

  // Add more tests for other methods like obterTodos, obterPorId, atualizar, etc.
});