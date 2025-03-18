import { MongoDB } from '../infrastructure/database/MongoDB';
import { AtividadeRepositoryImpl } from '../infrastructure/repositories/AtividadeRepositoryImpl';
import { VendedorRepositoryImpl } from '../infrastructure/repositories/VendedorRepositoryImpl';
import { EquipeRepositoryImpl } from '../infrastructure/repositories/EquipeRepositoryImpl';
import { MetaRepositoryImpl } from '../infrastructure/repositories/MetaRepositoryImpl';
import { FrequenciaVendasService } from '../application/services/FrequenciaVendasService';
import { ObterEquipeDadosFull } from '../application/use-cases/ObterEquipeDadosFull';
import { AtividadeService } from '../application/services/AtividadeService';
import { OllamaService } from '../application/services/OllamaService';
import fs from 'fs';
import path from 'path';

// ... resto do código permanece igual ... 