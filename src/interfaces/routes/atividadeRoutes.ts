import express from "express";
import { AtividadeRepositoryImpl } from "../../infrastructure/repositories/AtividadeRepositoryImpl";
import { VendedorRepositoryImpl } from "../../infrastructure/repositories/VendedorRepositoryImpl";
import { EquipeRepositoryImpl } from "../../infrastructure/repositories/EquipeRepositoryImpl";
import { MetaRepositoryImpl } from "../../infrastructure/repositories/MetaRepositoryImpl";
import { AtividadeService } from "../../application/services/AtividadeService";
import { ObterAtividades } from "../../application/use-cases/ObterAtividades";
import { AtualizarAtividade } from "../../application/use-cases/AtualizarAtividade";
import { ObterAtividadesPorVendedorEData } from "../../application/use-cases/ObterAtividadesPorVendedorEData";
import { AtividadeController } from "../controllers/AtividadeController";
import { CriarAtividade } from "../../application/use-cases/CriarAtividade";
import { FrequenciaVendasService } from "../../application/services/FrequenciaVendasService";
import { ObterEquipeDadosFull } from "../../application/use-cases/ObterEquipeDadosFull";

const router = express.Router();

// Repositories
const atividadeRepo = new AtividadeRepositoryImpl();
const vendedorRepo = new VendedorRepositoryImpl();
const equipeRepo = new EquipeRepositoryImpl();
const metaRepo = new MetaRepositoryImpl();

// Use Cases
const criarAtividade = new CriarAtividade(atividadeRepo);
const obterAtividade = new ObterAtividades(atividadeRepo);
const atualizarAtividade = new AtualizarAtividade(atividadeRepo);
const obterEquipeDadosFull = new ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);

// Services
const atividadeService = new AtividadeService(
    atividadeRepo,
    vendedorRepo,
    equipeRepo,
    metaRepo
);
const frequenciaVendasService = new FrequenciaVendasService(obterEquipeDadosFull);

const obterAtividadesPorVendedorEData = new ObterAtividadesPorVendedorEData(atividadeService);

// Controller
const atividadeController = new AtividadeController(
    criarAtividade,
    obterAtividade,
    atualizarAtividade,
    atividadeService,
    obterAtividadesPorVendedorEData,
    frequenciaVendasService
);

// Routes
router.post("/atividades", atividadeController.criar);
router.get("/atividades/all", atividadeController.obterTodos);
router.get("/atividades/:id", atividadeController.obterPorId);
router.get("/atividades/:id/detalhes", atividadeController.obterDetalhes);
router.put("/atividades/:id", atividadeController.atualizar);
router.get("/atividades/vendedor/:vendedorId", atividadeController.getAtividadesByVendedorAndDate);
router.get("/atividades/equipe/:equipeId/frequencia-vendas", atividadeController.calcularFrequenciaVendas);

export default router;