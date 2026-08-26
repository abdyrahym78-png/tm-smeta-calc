import express, { Request, Response } from 'express';

export const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const apiRouter = express.Router();

// Курсы валют по умолчанию
const DEFAULT_RATES = {
  OFFICIAL_USD: 3.50,
  MARKET_USD: 19.50,
  MARKET_EUR: 21.20
};

// 1. Список нормативных баз
apiRouter.get('/standards', (req: Request, res: Response) => {
  res.json({
    success: true,
    standards: ['GESN', 'Eurocodes', 'DIN', 'FIDIC']
  });
});

// 2. Справочник валют и курсов
apiRouter.get('/currencies', (req: Request, res: Response) => {
  res.json({
    success: true,
    rates: DEFAULT_RATES,
    updatedAt: new Date().toISOString()
  });
});

// 3. Справочник расценок
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

// 4. Авторизация
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { username, role = 'ENGINEER' } = req.body;
  res.json({
    success: true,
    token: "mock-jwt-token-xyz123",
    user: { username: username || "guest", role }
  });
});

// 5. BIM-маппинг
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

// 6. Мультивалютный расчет сметы (разделение государственных и рыночных затрат)
apiRouter.post('/estimates', (req: Request, res: Response) => {
  const {
    title,
    items = [],
    regionId = 'TM-AS',
    targetCurrency = 'TMT',
    customMarketRate = DEFAULT_RATES.MARKET_USD,
    customOfficialRate = DEFAULT_RATES.OFFICIAL_USD
  } = req.body;

  let totalDirectTmt = 0;
  let totalDirectUsd = 0;

  const processedItems = items.map((item: any, idx: number) => {
    const qty = item.quantity || 1;
    const price = item.unitPrice || 100;
    const itemCurrency = (item.currency || 'TMT').toUpperCase();
    const isStatePayment = item.isStatePayment || false;

    let priceInTmt = price;
    let priceInUsd = price;

    if (itemCurrency === 'USD') {
      const rateToUse = isStatePayment ? customOfficialRate : customMarketRate;
      priceInTmt = price * rateToUse;
    } else if (itemCurrency === 'TMT') {
      const rateToUse = isStatePayment ? customOfficialRate : customMarketRate;
      priceInUsd = price / rateToUse;
    }

    const itemTotalTmt = qty * priceInTmt;
    const itemTotalUsd = qty * priceInUsd;

    totalDirectTmt += itemTotalTmt;
    totalDirectUsd += itemTotalUsd;

    return {
      id: idx + 1,
      ...item,
      priceInTmt,
      priceInUsd,
      itemTotalTmt,
      itemTotalUsd
    };
  });

  const overheadTmt = totalDirectTmt * 0.10;
  const taxTmt = (totalDirectTmt + overheadTmt) * 0.15;
  const totalAmountTmt = totalDirectTmt + overheadTmt + taxTmt;

  const totalAmountUsd = totalAmountTmt / customMarketRate;

  res.json({
    success: true,
    estimate: {
      id: `est_${Date.now()}`,
      title: title || 'Мультивалютная смета',
      regionId,
      targetCurrency,
      exchangeRatesUsed: {
        officialUsd: customOfficialRate,
        marketUsd: customMarketRate
      },
      summary: {
        totalDirectTmt: Math.round(totalDirectTmt * 100) / 100,
        overheadTmt: Math.round(overheadTmt * 100) / 100,
        taxTmt: Math.round(taxTmt * 100) / 100,
        totalAmountTmt: Math.round(totalAmountTmt * 100) / 100,
        totalAmountUsd: Math.round(totalAmountUsd * 100) / 100
      },
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
