import { Router } from 'express';
import { RelatorioController } from '../controllers/RelatorioController';
import { RelatorioService } from '../../application/services/RelatorioService';
import { ObterRelatorio } from '../../application/use-cases/ObterRelatorio';

const router = Router();

const relatorioService = new RelatorioService();
const obterRelatorio = new ObterRelatorio(relatorioService);
const relatorioController = new RelatorioController(obterRelatorio);

router.get('/relatorios/atividades/montadora', (req, res) => relatorioController.atividadesPorMontadora(req, res));
router.get('/relatorios/atividades/vendedor', (req, res) => relatorioController.atividadesPorVendedor(req, res));
router.get('/relatorios/atividades/loja', (req, res) => relatorioController.atividadesPorLoja(req, res));
router.get('/relatorios/atividades/equipe', (req, res) => relatorioController.atividadesPorEquipe(req, res));
router.get('/relatorios/docinhos-coco', (req, res) => relatorioController.relatorioDocinhosCoco(req, res));

export default router; 