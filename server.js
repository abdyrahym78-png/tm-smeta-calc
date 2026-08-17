const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const { GoogleGenAI } = require('@google/genai');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Настройка Multer для сохранения в память (Buffer)
const upload = multer({ storage: multer.memoryStorage() });

// Инициализация Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/parse-estimate', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }

    const mimeType = req.file.mimetype;
    const fileBuffer = req.file.buffer.toString('base64');

    const prompt = `
Проанализируй этот документ/изображение строительной сметы и распознай все позиционные данные.
Верни результат СТРОГО в формате JSON без дополнительного текста и разметки markdown:
{
  "title": "Название сметы / проекта",
  "currency": "TMT / USD",
  "items": [
    {
      "name": "Наименование работ / материалов",
      "unit": "ед. изм.",
      "quantity": 0,
      "price": 0,
      "total": 0
    }
  ],
  "grandTotal": 0
}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { mimeType, data: fileBuffer } },
            { text: prompt }
          ]
        }
      ]
    });

    const text = response.text || '';
    // Очистка возможной обертки ```json
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const resultJson = JSON.parse(cleanText);

    res.json(resultJson);
  } catch (error) {
    console.error('Ошибка обработки сметы:', error);
    res.status(500).json({ error: 'Не удалось распознать смету', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Сервер сметного калькулятора запущен на порту ${port}`);
});
