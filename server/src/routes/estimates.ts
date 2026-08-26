import { Router, Request, Response } from 'express';
import { SmetaCalculator, CalculationInputItem } from '../engine/calculator';

export const estimatesRouter = Router();

let estimatesStore: any[] = [];

estimatesRouter.get('/', (req: Request, res: Response) => {
  res.json({ success: true, estimates: estimatesStore });
});

estimatesRouter.post('/', (req: Request, res: Response) => {
  const { projectId, title, currency = 'TMT', items = [] } = req.body;
  
  const processedItems = items.map((item: CalculationInputItem) => ({
    ...item,
    totalPrice: SmetaCalculator.calculateItemTotal(item)
  }));

  const totalAmount = SmetaCalculator.calculateEstimateTotal(processedItems);

  const newEstimate = {
    id: `est_${Date.now()}`,
    projectId,
    title: title || 'Новая смета',
    currency,
    items: processedItems,
    totalAmount,
    createdAt: new Date().toISOString()
  };

  estimatesStore.push(newEstimate);
  res.status(201).json({ success: true, estimate: newEstimate });
});

estimatesRouter.get('/:id', (req: Request, res: Response) => {
  const estimate = estimatesStore.find(e => e.id === req.params.id);
  if (!estimate) return res.status(404).json({ success: false, error: 'Estimate not found' });
  res.json({ success: true, estimate });
});

estimatesRouter.delete('/:id', (req: Request, res: Response) => {
  estimatesStore = estimatesStore.filter(e => e.id !== req.params.id);
  res.json({ success: true, message: 'Estimate deleted' });
});
