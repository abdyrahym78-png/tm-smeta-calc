import { Router, Request, Response } from 'express';
import { BimMapper } from '../services/bimMapper';
import { LocationService } from '../services/locationService';

export const bimRouter = Router();

bimRouter.post('/map', (req: Request, res: Response) => {
  const { bimSystem = 'UniClass2015', bimCode } = req.body;
  if (!bimCode) return res.status(400).json({ success: false, error: 'bimCode is required' });
  const mapping = BimMapper.mapCode(bimSystem, bimCode);
  res.json({ success: true, mapping });
});

bimRouter.get('/regions', (req: Request, res: Response) => {
  res.json({ success: true, regions: LocationService.listRegions() });
});
