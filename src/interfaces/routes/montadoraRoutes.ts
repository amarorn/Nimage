import { Router } from 'express';
import { MontadoraController } from '../controllers/MontadoraController';
import { CriarMontadora } from '../../application/use-cases/CriarMontadora';
import { ObterMontadora } from '../../application/use-cases/ObterMontadora';
import { AtualizarMontadora } from '../../application/use-cases/AtualizarMontadora';
import { DeletarMontadora } from '../../application/use-cases/DeletarMontadora';
import { MontadoraRepositoryImpl } from '../../infrastructure/repositories/MontadoraRepositoryImpl';

const router = Router();

// Repositories
const montadoraRepository = new MontadoraRepositoryImpl();

// Use Cases
const criarMontadora = new CriarMontadora(montadoraRepository);
const obterMontadora = new ObterMontadora(montadoraRepository);
const atualizarMontadora = new AtualizarMontadora(montadoraRepository);
const deletarMontadora = new DeletarMontadora(montadoraRepository);

// Controller
const montadoraController = new MontadoraController(
  criarMontadora,
  obterMontadora,
  atualizarMontadora,
  deletarMontadora
);

// Routes
router.post('/montadoras', (req, res) => montadoraController.criar(req, res));
router.get('/montadoras', (req, res) => montadoraController.obterTodos(req, res));
router.get('/montadoras/all', (req, res) => montadoraController.obterTodosCompleto(req, res));
router.get('/montadoras/:id', (req, res) => montadoraController.obterPorId(req, res));
router.put('/montadoras/:id', (req, res) => montadoraController.atualizar(req, res));
router.delete('/montadoras/:id', (req, res) => montadoraController.deletar(req, res));

export default router; 