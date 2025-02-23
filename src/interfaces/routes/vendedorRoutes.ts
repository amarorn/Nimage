import { Router } from "express";
import { VendedorRepositoryImpl } from "../../infrastructure/repositories/VendedorRepositoryImpl";
import { CriarVendedor } from "../../application/use-cases/CriarVendedor";
import { ObterVendedor } from "../../application/use-cases/ObterVendedor";
import { AtualizarVendedor } from "../../application/use-cases/AtualizarVendedor";
import { VendedorController } from "../controllers/VendedorController";

const router = Router();
const vendedorRepo = new VendedorRepositoryImpl();
const criarVendedor = new CriarVendedor(vendedorRepo);
const obterVendedor = new ObterVendedor(vendedorRepo);
const atualizarVendedor = new AtualizarVendedor(vendedorRepo);
const vendedorController = new VendedorController(criarVendedor, obterVendedor, atualizarVendedor);

//console.log("🚀vendedorController Routes");
router.post("/vendedores", async (req, res) => {
    //console.log("📨 Nova requisição POST /vendedores");
    return vendedorController.criar(req, res);
});

router.get("/vendedores/all", async (req, res) => {
    //console.log("📨 Nova requisição GET /vendedores");
    const vendedores = await vendedorController.obterTodos(req, res);
    return res.json(vendedores);
});

router.get("/vendedores/:id", async (req, res) => {
    //console.log("📨 Nova requisição GET /vendedores/:id");
    return vendedorController.obterPorId(req, res);
});

router.put("/vendedores/:id", async (req, res) => {
    //console.log("📨 Nova requisição PUT /vendedores/:id");
    return vendedorController.atualizar(req, res);
});

export default router;