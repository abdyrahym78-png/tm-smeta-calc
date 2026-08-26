import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import i18next from 'i18next';
import middleware from 'i18next-http-middleware';
import { projectsRouter } from './routes/projects';
import { estimatesRouter } from './routes/estimates';
import { bimRouter } from './routes/bim';
import { exportRouter } from './routes/export';
import { authRouter } from './routes/auth';
import { PdfExporter } from './services/pdfExporter';
import { authMiddleware } from './middleware/auth';

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
  info: { title: 'TM-Smeta API', version: '4.0.0' },
  paths: {
    '/api/v1/auth/login': { post: { summary: 'JWT authorization login', responses: { 200: { description: 'OK' } } } },
    '/api/v1/estimates/{id}/pdf': { get: { summary: 'Generate printable HTML/PDF estimate document', responses: { 200: { description: 'OK' } } } }
  }
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/projects', authMiddleware(['ADMIN', 'ENGINEER']), projectsRouter);
app.use('/api/v1/estimates', estimatesRouter);
app.use('/api/v1/bim', bimRouter);
app.use('/api/v1/estimates', exportRouter);

app.get('/api/v1/estimates/:id/pdf', (req: Request, res: Response) => {
  const mockEstimate = {
    id: req.params.id,
    title: 'Печатная смета проекта',
    totalAmount: 12500.0,
    currency: 'TMT',
    items: [{ id: '1', quantity: 25, unitPrice: 500, totalPrice: 12500 }]
  };
  const html = PdfExporter.generateEstimateHtml(mockEstimate);
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => console.log('Server running on port 3000. Docs at /docs'));
}
