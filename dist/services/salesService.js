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
exports.SalesService = void 0;
class SalesService {
    constructor(vendorRepository, salesRepository) {
        this.vendorRepository = vendorRepository;
        this.salesRepository = salesRepository;
    }
    getAllVendors() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.vendorRepository.getAllVendors();
        });
    }
    calculateVendorMetrics(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sales = yield this.salesRepository.findByVendorId(vendorId);
            const vendor = yield this.vendorRepository.findById(vendorId);
            if (!vendor) {
                throw new Error('Vendor not found');
            }
            const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
            const daysWithActivity = sales.length;
            const averagePerDay = daysWithActivity > 0 ? totalSales / daysWithActivity : 0;
            // Cálculos simplificados para exemplo
            const fea = averagePerDay > 100 ? 1.5 : averagePerDay > 50 ? 1.0 : 0.5;
            const iap = averagePerDay * fea;
            const teamGoal = 1000; // Meta fixa para exemplo
            return {
                fea,
                iap,
                daysWithActivity,
                totalSales,
                averagePerDay,
                teamGoal
            };
        });
    }
}
exports.SalesService = SalesService;
