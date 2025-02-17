import { Router } from "express";
import { VendedorRepositoryImpl } from "../../infrastructure/repositories/VendedorRepositoryImpl";
import { CriarVendedor } from "../../application/use-cases/CriarVendedor";
import { VendedorController } from "../controllers/VendedorController";

const router = Router();
const vendedorRepo = new VendedorRepositoryImpl();
const criarVendedor = new CriarVendedor(vendedorRepo);
const vendedorController = new VendedorController(criarVendedor);

console.log("🚀vendedorController Routes");
router.post("/vendedores", async (req, res) => {
    console.log("📨 Nova requisição POST /vendedores");
    return vendedorController.criar(req, res);
});

export default router;