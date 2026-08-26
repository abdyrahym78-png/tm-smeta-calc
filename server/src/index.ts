import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import i18next from 'i18next';
import middleware from 'i18next-http-middleware';
import { projectsRouter } from './routes/projects';
import { estimatesRouter } from './routes/estimates';
import { bimRouter } from './routes/bim';
import { exportRouter } from './routes/export';

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
  info: { title: 'TM-Smeta API', version: '3.0.0' },
  paths: {
    '/api/v1/bim/map': { post: { summary: 'Map BIM code to normative rate', responses: { 200: { description: 'OK' } } } },
    '/api/v1/bim/regions': { get: { summary: 'Get regional coefficients list', responses: { 200: { description: 'OK' } } } },
    '/api/v1/estimates/{id}/export': { get: { summary: 'Export estimate (json/csv/html)', responses: { 200: { description: 'OK' } } } }
  }
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1/projects', projectsRouter);
app.use('/api/v1/estimates', estimatesRouter);
app.use('/api/v1/bim', bimRouter);
app.use('/api/v1/estimates', exportRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => console.log('Server running on port 3000. Docs at /docs'));
}
