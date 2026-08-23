const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });
const API_KEY_SECRET = 'sitex-demo-key-2026';

function sanitizeText(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{2,4}/g, '[ТЕЛЕФОН СКРЫТ]')
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL СКРЫТ]')
    .replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, '[КАРТА СКРЫТА]')
    .replace(/\b\d{10,12}\b/g, '[РЕКВИЗИТ СКРЫТ]');
}

function checkApiKey(req, res, next) {
  const userKey = req.headers['x-api-key'];
  if (!userKey || userKey !== API_KEY_SECRET) {
    return res.status(401).json({ error: 'Недействительный или отсутствующий API Key приложения' });
  }
  next();
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), pii_protection: 'active' });
});

app.post('/api/parse', checkApiKey, upload.array('files', 10), async (req, res) => {
  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    const { language = 'ru', currency = 'TMT', vatRate = 0 } = req.body;

    if (geminiKey && req.files && req.files.length > 0) {
      const genAI = new GoogleGenerativeAI(geminiKey);
      
      // Актуальные модели Gemini 3.x
      const candidateModels = [
        'gemini-3.6-flash',
        'gemini-3.6-pro',
        'gemini-3.5-flash',
        'gemini-3.0-flash'
      ];

      const imageParts = req.files.map(file => ({
        inlineData: {
          data: file.buffer.toString('base64'),
          mimeType: file.mimetype
        }
      }));

      const prompt = `Проанализируй предоставленные изображения/документы сметы или чека.
Распознай все позиционные строки и верни строго JSON:
{
  "items": [
    {
      "code": "1",
      "name": "Наименование товара или услуги",
      "category": "Material",
      "unit": "шт",
      "count": 10,
      "price": 50.0,
      "sum": 500.0
    }
  ]
}
Язык ответа: ${language}.
ВАЖНО: Верни исключительно чистый JSON без markdown (без \`\`\`json).`;

      let lastError = null;
      let responseText = null;
      let usedModel = null;

      for (const modelName of candidateModels) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent([prompt, ...imageParts]);
          responseText = result.response.text();
          usedModel = modelName;
          console.log(`✅ Успешный ответ от модели: ${usedModel}`);
          break;
        } catch (err) {
          console.warn(`Модель ${modelName} недоступна: ${err.message}`);
          lastError = err;
        }
      }

      if (!responseText) {
        return res.status(400).json({
          error: `Ошибка Gemini API: ни одна из моделей не ответила. Последнее сообщение: ${lastError ? lastError.message : 'Unknown error'}`
        });
      }

      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanJson);

      const items = (parsedData.items || []).map((item, idx) => ({
        code: item.code || String(idx + 1),
        name: sanitizeText(item.name || 'Товар/Услуга'),
        category: item.category || 'Material',
        unit: item.unit || 'шт',
        count: Number(item.count) || 1,
        price: Number(item.price) || 0,
        sum: Number(item.sum) || (Number(item.count || 1) * Number(item.price || 0))
      }));

      const totalNet = items.reduce((acc, item) => acc + item.sum, 0);
      const vatNum = parseFloat(vatRate) || 0;
      const totalVat = (totalNet * vatNum) / 100;
      const totalGross = totalNet + totalVat;

      return res.json({
        metadata: {
          language,
          currency,
          vat_rate_percent: vatNum,
          total_net: totalNet,
          total_vat: totalVat,
          total_gross: totalGross,
          pii_sanitized: true,
          mode: 'real_vision',
          model_used: usedModel
        },
        items
      });
    }

    // Демо-данные (если фото не передано)
    const sampleItems = [
      { code: '1', name: 'Кабель 3x2.5', category: 'Material', unit: 'м', count: 50, price: 12.00, sum: 600.00 },
      { code: '2', name: 'Автомат 16A', category: 'Material', unit: 'шт', count: 4, price: 45.00, sum: 180.00 },
      { code: '3', name: 'Розетка 2-ая', category: 'Material', unit: 'шт', count: 10, price: 25.00, sum: 250.00 },
      { code: '4', name: 'Профиль CD', category: 'Material', unit: 'шт', count: 15, price: 38.00, sum: 570.00 },
      { code: '5', name: 'Гипсокартон', category: 'Material', unit: 'лист', count: 8, price: 110.00, sum: 880.00 }
    ];

    const totalNet = sampleItems.reduce((acc, item) => acc + item.sum, 0);
    const vatNum = parseFloat(vatRate) || 0;
    const totalVat = (totalNet * vatNum) / 100;
    const totalGross = totalNet + totalVat;

    return res.json({
      metadata: {
        language,
        currency,
        vat_rate_percent: vatNum,
        total_net: totalNet,
        total_vat: totalVat,
        total_gross: totalGross,
        pii_sanitized: true,
        mode: 'demo'
      },
      items: sampleItems.map(item => ({
        ...item,
        name: sanitizeText(item.name)
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5001, () => {
  console.log('🚀 Сервер запущен на порту 5001 (Gemini 3.6 Flash)');
});
