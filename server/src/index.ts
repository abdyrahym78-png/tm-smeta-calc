import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import i18next from 'i18next';
import middleware from 'i18next-http-middleware';

export const app = express();
app.use(express.json());
app.use(cors());

i18next.use(middleware.LanguageDetector).init({
  fallbackLng: 'ru',
  resources: {
    ru: { translation: { welcome: "Сметный сервис TM-Smeta" } },
    tk: { translation: { welcome: "TM-Smeta taslama hyzmaty" } },
    en: { translation: { welcome: "TM-Smeta Estimation Service" } }
  }
});
app.use(middleware.handle(i18next));

const swaggerDocument = {
  openapi: '3.0.0',
  info: { title: 'TM-Smeta API', version: '1.0.0' },
  paths: {
    '/api/v1/standards': { get: { summary: 'Get standards (DIN, Eurocodes, FIDIC)', responses: { 200: { description: 'OK' } } } },
    '/api/v1/rates': { get: { summary: 'Filter rates with multipliers', responses: { 200: { description: 'OK' } } } },
    '/api/v1/estimates': { post: { summary: 'Calculate estimate', responses: { 200: { description: 'OK' } } } }
  }
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/v1/standards', (req: Request, res: Response) => {
  res.json({ success: true, standards: ['DIN', 'Eurocodes', 'FIDIC', 'ГEСН'] });
});

app.get('/api/v1/rates', (req: Request, res: Response) => {
  const { country = 'TM', bimSystem } = req.query;
  res.json({
    success: true,
    country,
    bimSystem: bimSystem || 'UniClass2015',
    rates: [{ code: 'R-001', price: 150.0, currency: 'TMT', locationCoeff: 1.0 }]
  });
});

app.post('/api/v1/estimates', (req: Request, res: Response) => {
  res.json({ success: true, total: 150.0, currency: 'TMT' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => console.log('Server running on port 3000. Docs at /docs'));
}
