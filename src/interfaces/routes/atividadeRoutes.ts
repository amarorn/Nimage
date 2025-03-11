import { Router } from "express";
import { AtividadeRepositoryImpl } from "../../infrastructure/repositories/AtividadeRepositoryImpl";
import { CriarAtividade } from "../../application/use-cases/CriarAtividade";
import { AtividadeController } from "../controllers/AtividadeController";
import { ObterAtividades } from "../../application/use-cases/ObterAtividades";
import { AtualizarAtividade } from "../../application/use-cases/AtualizarAtividade";
import { AtividadeService } from "../../application/services/AtividadeService";
import { ObterAtividadesPorVendedorEData } from "../../application/use-cases/ObterAtividadesPorVendedorEData";
import { FrequenciaVendasService } from "../../application/services/FrequenciaVendasService";
import { ObterEquipeDadosFull } from "../../application/use-cases/ObterEquipeDadosFull";
import { EquipeRepositoryImpl } from "../../infrastructure/repositories/EquipeRepositoryImpl";
import { VendedorRepositoryImpl } from "../../infrastructure/repositories/VendedorRepositoryImpl";
import { MetaRepositoryImpl } from "../../infrastructure/repositories/MetaRepositoryImpl";


const router = Router();
const atividadeRepo = new AtividadeRepositoryImpl();
const criarAtividade = new CriarAtividade(atividadeRepo);
const obterAtividade  = new ObterAtividades(atividadeRepo);
const atualizarAtividade = new AtualizarAtividade(atividadeRepo);
const atividadeService = new AtividadeService(atividadeRepo);
const obterAtividadesPorVendedorEData = new ObterAtividadesPorVendedorEData(atividadeService);
const equipeRepo = new EquipeRepositoryImpl();
const vendedorRepo = new VendedorRepositoryImpl();
const metaRepo = new MetaRepositoryImpl();
const obterEquipeDadosFull = new ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);
const frequenciaVendasService = new FrequenciaVendasService(obterEquipeDadosFull);
const atividadeController = new AtividadeController(criarAtividade, obterAtividade, atualizarAtividade, atividadeService, obterAtividadesPorVendedorEData, frequenciaVendasService);

router.post("/atividades", async (req, res) => {
    //console.log("📨 Nova requisição POST /atividades");
    return atividadeController.criar(req, res);
});

router.get("/atividades/all", async (req, res) => {
    //console.log("📨 Nova requisição GET /atividades");
    const atividades = await atividadeController.obterTodos(req, res);
    return res.json(atividades);
});

router.get("/atividades/:id", async (req, res) => {
    //console.log("📨 Nova requisição GET /atividades/:id");
    return atividadeController.obterPorId(req, res);
});

router.get("/atividades/:id/detalhes", async (req, res) => {
    //console.log("📨 Nova requisição GET /atividades/:id/detalhes");
    return atividadeController.obterDetalhes(req, res);
});

router.put("/atividades/:id", async (req, res) => {
    //console.log("📨 Nova requisição PUT /atividades/:id");
    return atividadeController.atualizar(req, res);
});

router.get("/atividades/vendedor/:vendedorId", async (req, res) => {
    //console.log("📨 Nova requisição GET /atividades/vendedor/:vendedorId");
    return atividadeController.getAtividadesByVendedorAndDate(req, res);
});

router.get("/atividades/equipe/:equipeId/frequencia-vendas", async (req, res) => {
    //console.log("📨 Nova requisição GET /atividades/equipe/:equipeId/frequencia-vendas");
    return atividadeController.calcularFrequenciaVendas(req, res);
});

export default router;