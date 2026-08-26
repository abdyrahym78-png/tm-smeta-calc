import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Роутер API V1
const apiRouter = express.Router();

// 1. Список нормативных баз
apiRouter.get('/standards', (req: Request, res: Response) => {
  res.json({
    success: true,
    standards: ['GESN', 'Eurocodes', 'DIN', 'FIDIC']
  });
});

// 2. Пример авторизации
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { username } = req.body;
  res.json({
    success: true,
    token: "mock-jwt-token-xyz123",
    user: { username: username || "guest" }
  });
});

// 3. BIM-маппинг
apiRouter.post('/bim/map', (req: Request, res: Response) => {
  const { classificationCode } = req.body;
  res.json({
    success: true,
    mappedRate: {
      code: classificationCode || "Pr_20_31",
      description: "Бетонные работы по UniClass 2015",
      unitPriceTMT: 450.00
    }
  });
});

// Монтируем роуты V1
app.use('/api/v1', apiRouter);

// Корневой маршрут проверки здоровья
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/api/v1`);
});
