import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { EquipeModel } from '../../infrastructure/database/models/EquipeModel';
import { VendedorModel } from '../../infrastructure/database/models/VendedorModel';
import { AtividadeModel } from '../../infrastructure/database/models/AtividadeModel';
import { MetaModel } from '../../infrastructure/database/models/MetaModel';
import { Equipe } from '../../domain/entities/Equipe';
import { Vendedor } from '../../domain/entities/Vendedor';
import { Atividade } from '../../domain/entities/Atividade';
import { Meta } from '../../domain/entities/Meta';
import { EquipeRepositoryImpl } from '../../infrastructure/repositories/EquipeRepositoryImpl';
import { VendedorRepositoryImpl } from '../../infrastructure/repositories/VendedorRepositoryImpl';
import { AtividadeRepositoryImpl } from '../../infrastructure/repositories/AtividadeRepositoryImpl';
import { TemaRepositoryImpl } from '../../infrastructure/repositories/TemaRepositoryImpl';

// Interfaces para tipagem
interface TemaResponse {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
    temas: Array<{
        id: string;
        nome: string;
        descricao: string;
        cor: string;
    }>;
}

interface CargoResponse {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
    cargos: Array<{
        id: string;
        nome: string;
        descricao: string;
        tag: string;
    }>;
}

interface EquipeResponse {
    pagina: number;
    limite: number;
    total: number;
    equipes: Array<{
        id: string;
        nome: string;
        pdv: string;
        cidade: string;
        estado: string;
        gerenteNome: string;
        gerenteTelefone: string;
        capitaoNome: string;
        capitaoTelefone: string;
        temaId: string;
    }>;
}

interface VendedorResponse {
    pagina: number;
    limite: number;
    total: number;
    vendedores: Array<{
        id: string;
        nome: string;
        cargoId: string;
        equipeId: string;
    }>;
}

// Função para gerar temas
async function generateTemas() {
    const temas = [
        { id: "tema-1", nome: "Gladiador", descricao: "Equipe Gladiador - Força e Determinação", cor: "#FF0000" },
        { id: "tema-2", nome: "Arqueiro", descricao: "Equipe Arqueiro - Precisão e Foco", cor: "#00FF00" },
        { id: "tema-3", nome: "Titã", descricao: "Equipe Titã - Poder e Resistência", cor: "#0000FF" },
        { id: "tema-4", nome: "Lutador", descricao: "Equipe Lutador - Coragem e Persistência", cor: "#FFA500" }
    ];

    const temasExistentes = await axios.get<TemaResponse>('http://localhost:3001/api/temas/all');
    const temasIds = new Set(temasExistentes.data.temas.map(t => t.id));

    for (const tema of temas) {
        if (!temasIds.has(tema.id)) {
            try {
                await axios.post('http://localhost:3001/api/temas', tema);
                console.log(`Tema ${tema.nome} criado com sucesso`);
            } catch (error) {
                console.error(`Erro ao criar tema ${tema.nome}:`, error);
            }
        } else {
            console.log(`Tema ${tema.nome} já existe`);
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

    const cargosExistentes = await axios.get<CargoResponse>('http://localhost:3001/api/cargos/all');
    const cargosIds = new Set(cargosExistentes.data.cargos.map(c => c.id));

    for (const cargo of cargos) {
        if (!cargosIds.has(cargo.id)) {
            try {
                await axios.post('http://localhost:3001/api/cargos', cargo);
                console.log(`Cargo ${cargo.nome} criado com sucesso`);
            } catch (error) {
                console.error(`Erro ao criar cargo ${cargo.nome}:`, error);
            }
        } else {
            console.log(`Cargo ${cargo.nome} já existe`);
        }
    }

    return cargos;
}

// Função para distribuir cargos aleatoriamente
function distribuirCargos(numeroVendedores: number): string[] {
    const cargos = ["cargo-1", "cargo-2"]; // Gerente e Capitão
    const vendedores = Array(numeroVendedores - 2).fill("cargo-3"); // Vendedores
    return [...cargos, ...vendedores].sort(() => Math.random() - 0.5); // Mistura aleatoriamente
}

// Função para gerar equipes
async function generateEquipes(temas: any[]) {
    const equipesExistentes = await axios.get<EquipeResponse>('http://localhost:3001/api/equipes/all');
    const equipesIds = new Set(equipesExistentes.data.equipes.map(e => e.id));

    for (let i = 1; i <= temas.length; i++) {
        const equipe = {
            id: `equipe-${i}`,
            nome: `Equipe ${temas[i-1].nome}`,
            temaId: `tema-${i}`,
            pdv: `PDV ${i}`,
            cidade: "São Paulo",
            estado: "SP",
            gerenteNome: `Gerente da Equipe ${i}`,
            gerenteTelefone: `(11) 9999-${i}000`,
            capitaoNome: `Capitão da Equipe ${i}`,
            capitaoTelefone: `(11) 9999-${i}001`
        };

        if (!equipesIds.has(equipe.id)) {
            try {
                await axios.post('http://localhost:3001/api/equipes', equipe);
                console.log(`Equipe ${equipe.nome} criada com sucesso`);
            } catch (error) {
                console.error(`Erro ao criar equipe ${equipe.nome}:`, error);
            }
        } else {
            console.log(`Equipe ${equipe.nome} já existe`);
        }
    }
}

// Função para gerar vendedores
async function generateVendedores() {
    const equipesResponse = await axios.get<EquipeResponse>('http://localhost:3001/api/equipes/all');
    const equipes = equipesResponse.data.equipes;
    const vendedoresExistentes = await axios.get<VendedorResponse>('http://localhost:3001/api/vendedores/all');
    const vendedoresIds = new Set(vendedoresExistentes.data.vendedores.map(v => v.id));

    for (let i = 1; i <= equipes.length; i++) {
        const numVendedores = i === 4 ? 9 : 5; // Equipe 4 tem 9 vendedores
        for (let j = 1; j <= numVendedores; j++) {
            const vendedor = {
                id: `vendedor-${i}-${j}`,
                nome: `Vendedor ${i}-${j}`,
                email: `vendedor${i}-${j}@nimage.com.br`,
                telefone: `(11) 9${i}${j}${j}${j}-${i}${j}${j}${j}`,
                meta: 1000 + (i * 100) + (j * 10), // Meta em quantidade de docinhos
                cargo: "cargo-3", // Vendedor padrão
                equipeId: `equipe-${i}`
            };

            // Ajusta o cargo para capitão e gerente
            if (j === numVendedores - 1) vendedor.cargo = "cargo-2"; // Penúltimo é capitão
            if (j === numVendedores) vendedor.cargo = "cargo-1"; // Último é gerente

            if (!vendedoresIds.has(vendedor.id)) {
                try {
                    await axios.post('http://localhost:3001/api/vendedores', vendedor);
                    console.log(`Vendedor ${vendedor.nome} criado com sucesso`);
                } catch (error) {
                    console.error(`Erro ao criar vendedor ${vendedor.nome}:`, error);
                }
            } else {
                console.log(`Vendedor ${vendedor.nome} já existe`);
            }
        }
    }
}

// Função principal para gerar dados
async function generateData() {
    const temas = await generateTemas();
    const cargos = await generateCargos();
    await generateEquipes(temas);
    await generateVendedores();

    console.log("\nGeração de dados concluída com sucesso!");
    console.log("\nResumo da geração:");
    console.log("==============================\n");
    console.log("🎨 Temas:");
    console.log(`  • Total: ${temas.length}`);
}

// Executa a geração de dados
generateData(); 