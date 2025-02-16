"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendedorController = void 0;
class VendedorController {
    constructor(criarVendedor) {
        this.criarVendedor = criarVendedor;
    }
    criar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, nome, equipe } = req.body;
            console.log("Recebendo dados no Controller:", req.body);
            const vendedor = yield this.criarVendedor.executar({ id, nome, equipe });
            res.status(201).json(vendedor);
        });
    }
}
exports.VendedorController = VendedorController;
