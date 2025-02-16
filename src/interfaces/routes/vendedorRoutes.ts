import { Router } from "express";
import { VendedorRepositoryImpl } from "../../infrastructure/repositories/VendedorRepositoryImpl";
import { CriarVendedor } from "../../application/use-cases/CriarVendedor";
import { VendedorController } from "../controllers/VendedorController";

const router = Router();
const vendedorRepo = new VendedorRepositoryImpl();
const criarVendedor = new CriarVendedor(vendedorRepo);
const vendedorController = new VendedorController(criarVendedor);

router.post("/vendedores", (req, res) => vendedorController.criar(req, res));

export default router;