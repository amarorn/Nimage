import { Router } from "express";
import { AtividadeRepositoryImpl } from "../../infrastructure/repositories/AtividadeRepositoryImpl";
import { VendedorRepositoryImpl } from "../../infrastructure/repositories/VendedorRepositoryImpl";
import { EquipeRepositoryImpl } from "../../infrastructure/repositories/EquipeRepositoryImpl";
import { MetaRepositoryImpl } from "../../infrastructure/repositories/MetaRepositoryImpl";
import { CriarAtividade } from "../../application/use-cases/CriarAtividade";
import { AtividadeController } from "../controllers/AtividadeController";
import { ObterAtividades } from "../../application/use-cases/ObterAtividades";
import { AtualizarAtividade } from "../../application/use-cases/AtualizarAtividade";
import { ObterAtividadesPorVendedorEData } from "../../application/use-cases/ObterAtividadesPorVendedorEData";
import { AtividadeService } from "../../application/services/AtividadeService";
import { FrequenciaVendasService } from "../../application/services/FrequenciaVendasService";
import { ObterEquipeDadosFull } from "../../application/use-cases/ObterEquipeDadosFull";

const router = Router();

// Repositories
const atividadeRepo = new AtividadeRepositoryImpl();
const vendedorRepo = new VendedorRepositoryImpl();
const equipeRepo = new EquipeRepositoryImpl();
const metaRepo = new MetaRepositoryImpl();

// Services
const atividadeService = new AtividadeService(atividadeRepo, vendedorRepo, equipeRepo, metaRepo);

// Use Cases
const criarAtividade = new CriarAtividade(atividadeRepo);
const obterAtividades = new ObterAtividades(atividadeRepo);
const atualizarAtividade = new AtualizarAtividade(atividadeRepo);
const obterAtividadesPorVendedorEData = new ObterAtividadesPorVendedorEData(atividadeService);
const obterEquipeDadosFull = new ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);
const frequenciaVendasService = new FrequenciaVendasService(obterEquipeDadosFull);

// Controller
const atividadeController = new AtividadeController(
    criarAtividade,
    obterAtividades,
    atualizarAtividade,
    atividadeService,
    obterAtividadesPorVendedorEData,
    frequenciaVendasService
);

// Routes
router.post("/atividades", async (req, res) => {
    return atividadeController.criar(req, res);
});

// Rota para obter todas as atividades (mantida para compatibilidade)
router.get("/atividades", async (req, res) => {
    return atividadeController.obterTodos(req, res);
});

// Nova rota /all que retorna todas as atividades sem paginação
router.get("/atividades/all", async (req, res) => {
    return atividadeController.obterTodosCompleto(req, res);
});

router.get("/atividades/:id", async (req, res) => {
    return atividadeController.obterPorId(req, res);
});

router.put("/atividades/:id", async (req, res) => {
    return atividadeController.atualizar(req, res);
});

router.get("/atividades/vendedor/:vendedorId", async (req, res) => {
    return atividadeController.getAtividadesByVendedorAndDate(req, res);
});

router.get("/atividades/equipe/:equipeId", async (req, res) => {
    return atividadeController.getAtividadesByVendedorAndDate(req, res);
});

router.get("/atividades/vendedor/:vendedorId/data", async (req, res) => {
    return atividadeController.getAtividadesByVendedorAndDate(req, res);
});

router.get("/atividades/equipe/:equipeId/frequencia-vendas", async (req, res) => {
    return atividadeController.calcularFrequenciaVendas(req, res);
});

export default router;