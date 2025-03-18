import { VendorRepository } from '../repositories/vendorRepository';
import { SalesRepository } from '../repositories/salesRepository';

export interface VendorMetrics {
  fea: number;
  iap: number;
  daysWithActivity: number;
  totalSales: number;
  averagePerDay: number;
  teamGoal: number;
}

export class SalesService {
  constructor(
    private vendorRepository: VendorRepository,
    private salesRepository: SalesRepository
  ) {}

  async getAllVendors() {
    return this.vendorRepository.findAll();
  }

  async calculateVendorMetrics(vendorId: string): Promise<VendorMetrics> {
    const vendor = await this.vendorRepository.findById(vendorId);
    if (!vendor) {
      throw new Error('Vendedor não encontrado');
    }

    const sales = await this.salesRepository.findByVendorId(vendorId);
    const team = await this.vendorRepository.findTeamByVendorId(vendorId);

    const daysWithActivity = sales.length;
    const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const averagePerDay = daysWithActivity > 0 ? totalSales / daysWithActivity : 0;

    // Calcula FEA (Fator de Eficiência de Atividade)
    const fea = this.calculateFEA(sales, team?.totalDays || 30);

    // Calcula IAP (Indicador de Atividade Potencial)
    const iap = this.calculateIAP(averagePerDay, team?.totalDays || 30, daysWithActivity);

    return {
      fea,
      iap,
      daysWithActivity,
      totalSales,
      averagePerDay,
      teamGoal: team?.goal || 5000
    };
  }

  private calculateFEA(sales: any[], totalDays: number): number {
    const daysWithActivity = sales.length;
    return daysWithActivity / (totalDays * 0.7); // 70% dos dias são considerados dias úteis
  }

  private calculateIAP(averagePerDay: number, totalDays: number, daysWithActivity: number): number {
    const availableDays = totalDays * 0.7; // 70% dos dias são considerados dias úteis
    return averagePerDay * (availableDays - daysWithActivity);
  }
} 