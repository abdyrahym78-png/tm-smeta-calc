import { Router } from 'express';
import { KSGeneratorService } from '../services/ksGenerator.service';
import { KS2KS3Payload } from '../types/ks2ks3.types';

export const exportRouter = Router();

exportRouter.post('/export-pdf', (req, res) => {
  try {
    const payload: KS2KS3Payload = req.body;
    const html = KSGeneratorService.generateHTML(payload);
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (err: any) {
    res.status(500).json({ error: 'Ошибка генерации документа', details: err.message });
  }
});
