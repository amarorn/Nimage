import { Router } from 'express';
import { LojaController } from '../controllers/LojaController';
import { CriarLoja } from '../../application/use-cases/CriarLoja';
import { AtualizarLoja } from '../../application/use-cases/AtualizarLoja';
import { ObterLoja } from '../../application/use-cases/ObterLoja';
import { DeletarLoja } from '../../application/use-cases/DeletarLoja';
import { LojaRepositoryImpl } from '../../infrastructure/repositories/LojaRepositoryImpl';

const router = Router();

// Repositories
const lojaRepository = new LojaRepositoryImpl();

// Use Cases
const criarLoja = new CriarLoja(lojaRepository);
const atualizarLoja = new AtualizarLoja(lojaRepository);
const obterLoja = new ObterLoja(lojaRepository);
const deletarLoja = new DeletarLoja(lojaRepository);

// Controller
const lojaController = new LojaController(
    criarLoja,
    atualizarLoja,
    obterLoja,
    deletarLoja
);

// Routes
router.post('/lojas', (req, res) => lojaController.criar(req, res));
router.get('/lojas/all', (req, res) => lojaController.obterTodosCompleto(req, res));
router.get('/lojas/:id', (req, res) => lojaController.obterPorId(req, res));
router.put('/lojas/:id', (req, res) => lojaController.atualizar(req, res));
router.delete('/lojas/:id', (req, res) => lojaController.deletar(req, res));

export default router; 