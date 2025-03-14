import { Router, Request, Response } from 'express';
import { GetVendorInsights } from '../../application/use-cases/GetVendorInsights';

const router = Router();
const getVendorInsights = new GetVendorInsights();

router.post('/vendor-insights', async (req: Request, res: Response) => {
    try {
        const { vendorInfo } = req.body;
        const { dataInicio, dataFim } = req.query;
        const insights = await getVendorInsights.execute(vendorInfo, new Date(dataInicio as string), new Date(dataFim as string));
        res.status(200).json(insights);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get vendor insights', details: (error as Error).message });
    }
});

export default router; 