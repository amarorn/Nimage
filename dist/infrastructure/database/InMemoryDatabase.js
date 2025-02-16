"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InMemoryDatabase {
    constructor() {
        this.vendedores = [];
        this.atividades = [];
        this.equipes = [];
        this.metas = [];
    }
    static getInstance() {
        if (!InMemoryDatabase.instance) {
            InMemoryDatabase.instance = new InMemoryDatabase();
        }
        return InMemoryDatabase.instance;
    }
    // Métodos para Vendedores
    adicionarVendedor(vendedor) {
        this.vendedores.push(vendedor);
    }
    obterVendedorPorId(id) {
        return this.vendedores.find(v => v.id === id) || null;
    }
    // Métodos para Atividades
    adicionarAtividade(atividade) {
        this.atividades.push(atividade);
    }
    obterAtividadePorId(id) {
        return this.atividades.find(a => a.id === id) || null;
    }
    obterAtividadesPorVendedor(vendedorId) {
        return this.atividades.filter(a => a.vendedorId === vendedorId);
    }
    // Métodos para Equipes
    adicionarEquipe(equipe) {
        this.equipes.push(equipe);
    }
    obterEquipePorId(id) {
        return this.equipes.find(e => e.id === id) || null;
    }
    // Métodos para Metas
    adicionarMeta(meta) {
        this.metas.push(meta);
    }
    obterMetaPorEquipe(equipeId) {
        return this.metas.find(m => m.equipeId === equipeId) || null;
    }
}
exports.default = InMemoryDatabase.getInstance();
