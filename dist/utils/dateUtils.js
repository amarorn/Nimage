"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformarPrevisaoMensalEmDiaria = transformarPrevisaoMensalEmDiaria;
exports.formatarDataParaExibicao = formatarDataParaExibicao;
function transformarPrevisaoMensalEmDiaria(previsaoMensal) {
    const previsaoDiaria = [];
    // Mapeamento de meses em português para números
    const mesesMap = {
        'Janeiro': 0, 'Fevereiro': 1, 'Março': 2, 'Abril': 3,
        'Maio': 4, 'Junho': 5, 'Julho': 6, 'Agosto': 7,
        'Setembro': 8, 'Outubro': 9, 'Novembro': 10, 'Dezembro': 11
    };
    previsaoMensal.forEach(previsao => {
        const mesNumero = mesesMap[previsao.mes];
        const ano = new Date().getFullYear();
        // Cria data do primeiro dia do mês
        const primeiroDia = new Date(ano, mesNumero, 1);
        // Cria data do último dia do mês
        const ultimoDia = new Date(ano, mesNumero + 1, 0);
        // Calcula o valor diário
        const diasNoMes = ultimoDia.getDate();
        const valorDiario = previsao.valor / diasNoMes;
        // Gera previsão para cada dia do mês
        for (let dia = 1; dia <= diasNoMes; dia++) {
            const data = new Date(ano, mesNumero, dia);
            // Não inclui domingos
            if (data.getDay() !== 0) {
                previsaoDiaria.push({
                    data: data,
                    valor: Math.round(valorDiario)
                });
            }
        }
    });
    return previsaoDiaria;
}
function formatarDataParaExibicao(data) {
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
    });
}
//# sourceMappingURL=dateUtils.js.map