"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
// Função para gerar temas
async function generateTemas() {
    const temas = [
        { id: "tema-1", nome: "Gladiador", descricao: "Equipe Gladiador - Força e Determinação", cor: "#FF0000" },
        { id: "tema-2", nome: "Arqueiro", descricao: "Equipe Arqueiro - Precisão e Foco", cor: "#00FF00" },
        { id: "tema-3", nome: "Titã", descricao: "Equipe Titã - Poder e Resistência", cor: "#0000FF" },
        { id: "tema-4", nome: "Lutador", descricao: "Equipe Lutador - Coragem e Persistência", cor: "#FFA500" }
    ];
    for (const tema of temas) {
        try {
            await axios_1.default.post('http://localhost:3001/api/temas', tema);
            console.log(`Tema ${tema.nome} criado com sucesso`);
        }
        catch (error) {
            console.error(`Erro ao criar tema ${tema.nome}:`, error);
        }
    }
    return temas;
}
// Função para gerar cargos
async function generateCargos() {
    const cargos = [
        { id: "cargo-1", nome: "Gerente", descricao: "Gerente de Equipe", tag: "gerente" },
        { id: "cargo-2", nome: "Capitão", descricao: "Capitão de Equipe", tag: "capitao" },
        { id: "cargo-3", nome: "Vendedor", descricao: "Vendedor de Equipe", tag: "vendedor" }
    ];
    for (const cargo of cargos) {
        try {
            await axios_1.default.post('http://localhost:3001/api/cargos', cargo);
            console.log(`Cargo ${cargo.nome} criado com sucesso`);
        }
        catch (error) {
            console.error(`Erro ao criar cargo ${cargo.nome}:`, error);
        }
    }
    return cargos;
}
// Função para distribuir cargos aleatoriamente
function distribuirCargos(numeroVendedores) {
    const cargos = ["cargo-1", "cargo-2"]; // Gerente e Capitão
    const vendedores = Array(numeroVendedores - 2).fill("cargo-3"); // Vendedores
    return [...cargos, ...vendedores].sort(() => Math.random() - 0.5); // Mistura aleatoriamente
}
// Função para gerar equipes
async function generateEquipes() {
    const temasResponse = await axios_1.default.get('http://localhost:3001/api/temas/all');
    const temas = temasResponse.data.temas;
    const cargosResponse = await axios_1.default.get('http://localhost:3001/api/cargos/all');
    const cargos = cargosResponse.data.cargos;
    const equipes = [];
    for (let i = 1; i <= 4; i++) {
        const tema = temas[i - 1];
        const numeroVendedores = Math.floor(Math.random() * 5) + 5; // Entre 5 e 10 vendedores
        const cargosDistribuidos = distribuirCargos(numeroVendedores);
        const equipe = {
            id: `equipe-${i}`,
            nome: `Equipe ${tema.nome}`,
            temaId: tema.id,
            vendedores: cargosDistribuidos.map((cargoId, index) => ({
                id: `vendedor-${i}-${index + 1}`,
                nome: `Vendedor ${i}-${index + 1}`,
                cargoId: cargoId,
                equipeId: `equipe-${i}`
            }))
        };
        try {
            await axios_1.default.post('http://localhost:3001/api/equipes', equipe);
            console.log(`Equipe ${equipe.nome} criada com sucesso`);
            equipes.push(equipe);
        }
        catch (error) {
            console.error(`Erro ao criar equipe ${equipe.nome}:`, error);
        }
    }
    return equipes;
}
// Função principal
async function generateData() {
    try {
        console.log('Iniciando geração de dados...');
        // Gera temas e cargos primeiro
        await generateTemas();
        await generateCargos();
        // Gera equipes com os temas e cargos criados
        const equipes = await generateEquipes();
        console.log('Geração de dados concluída com sucesso!');
        console.log('\nResumo da geração:');
        console.log('==============================');
        console.log('\n🎨 Temas:');
        console.log(`  • Total: ${equipes.length}`);
        for (const equipe of equipes) {
            console.log(`    - ${equipe.nome}`);
        }
    }
    catch (error) {
        console.error('Erro ao gerar dados:', error);
    }
}
// Executa a geração de dados
generateData();
//# sourceMappingURL=generateMassData.js.map