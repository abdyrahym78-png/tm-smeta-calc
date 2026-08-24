import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;
const API_KEY = process.env.GEMINI_API_KEY;

const handleEstimateRequest = async (req, res) => {
  try {
    const { repairType, square, selectedCategories, categories } = req.body;
    
    const activeCategories = selectedCategories || categories || ['Стены', 'Полы'];
    const catsString = Array.isArray(activeCategories) ? activeCategories.join(', ') : activeCategories;

    const promptText = `Ты — опытный сметчик в Туркменистане. 
Составь реалистичную смету на ремонт помещения.

Параметры заказа:
- Вид ремонта: ${repairType || 'Косметический'}
- Площадь: ${square || 50} кв. м.
- Разрешенные категории работ: ${catsString}

СТРОГОЕ ПРАВИЛО: Составляй позиции СТРОГО И ТОЛЬКО для категорий из списка [${catsString}].
Категорически ЗАПРЕЩЕНО добавлять Электрику, Потолки, Сантехнику или другие категории, если их нет в списке [${catsString}].

Ответь СТРОГО в формате JSON массива объектов:
[
  {
    "id": 1,
    "name": "Шпаклевка стен",
    "category": "${Array.isArray(activeCategories) ? activeCategories[0] : 'Стены'}",
    "unit": "м²",
    "quantity": 50,
    "price": 30,
    "total": 1500,
    "total_gross": 1500,
    "currency": "TMT"
  }
]`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Ошибка API' });
    }

    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    let rawItems = JSON.parse(rawText);
    const items = Array.isArray(rawItems) ? rawItems : (rawItems.items || []);

    const grandTotal = items.reduce((acc, curr) => acc + (Number(curr.total) || Number(curr.total_gross) || 0), 0);

    const summaryObj = {
      total: grandTotal,
      total_gross: grandTotal,
      currency: 'TMT'
    };

    const finalResponse = {
      currency: 'TMT',
      totalPrice: grandTotal,
      total: grandTotal,
      total_gross: grandTotal,
      summary: summaryObj,
      totals: summaryObj,
      items: items.map(item => ({
        ...item,
        total_gross: item.total_gross || item.total || 0,
        currency: 'TMT'
      }))
    };

    res.json(finalResponse);

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Ошибка сервера при генерации сметы' });
  }
};

app.post('/api/quiz-estimate', handleEstimateRequest);
app.post('/api/generate', handleEstimateRequest);
app.post('/api/parse', handleEstimateRequest);

app.listen(PORT, () => {
  console.log(`🚀 API Сервер запущен на http://localhost:${PORT}`);
});
