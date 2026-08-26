import express, { Request, Response } from 'express';

export const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const apiRouter = express.Router();

// 1. Список нормативных баз
apiRouter.get('/standards', (req: Request, res: Response) => {
  res.json({
    success: true,
    standards: ['GESN', 'Eurocodes', 'DIN', 'FIDIC']
  });
});

// 2. Справочник расценок
apiRouter.get('/rates', (req: Request, res: Response) => {
  const { country = 'TM', bimSystem } = req.query;
  res.json({
    success: true,
    rates: [
      {
        id: 'rate_1',
        code: 'R-CONCRETE-01',
        name: 'Устройство монолитного бетонного фундамента B25',
        basePrice: 450.00,
        currency: 'TMT',
        countryCode: String(country),
        locationCoeff: 1.0,
        bimSystem: bimSystem ? String(bimSystem) : 'UniClass2015'
      }
    ]
  });
});

// 3. Авторизация
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { username, role = 'ENGINEER' } = req.body;
  res.json({
    success: true,
    token: "mock-jwt-token-xyz123",
    user: { username: username || "guest", role }
  });
});

// 4. BIM-маппинг
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

// 5. Расчет сметы
apiRouter.post('/estimates', (req: Request, res: Response) => {
  const { title, items = [], regionId = 'TM-AS', currency = 'TMT' } = req.body;

  let totalDirect = 0;
  const processedItems = items.map((item: any, idx: number) => {
    const qty = item.quantity || 1;
    const price = item.unitPrice || 100;
    const itemTotal = qty * price;
    totalDirect += itemTotal;
    return { id: idx + 1, ...item, itemTotal };
  });

  const overhead = totalDirect * 0.10;
  const tax = (totalDirect + overhead) * 0.15;
  const totalAmount = totalDirect + overhead + tax;

  res.json({
    success: true,
    estimate: {
      id: `est_${Date.now()}`,
      title: title || 'Расчетная смета',
      regionId,
      currency,
      totalDirect,
      overhead,
      tax,
      totalAmount,
      items: processedItems
    }
  });
});

app.use('/api/v1', apiRouter);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/api/v1`);
  });
}
