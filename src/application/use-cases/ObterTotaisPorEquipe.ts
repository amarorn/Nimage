import { TotaisService } from "../services/TotaisService";

export class ObterTotaisPorEquipe {
    constructor(private totaisService: TotaisService) {}

    async executar(equipeId: string) {
        return await this.totaisService.calcularTotaisPorEquipe(equipeId);
    }
} 