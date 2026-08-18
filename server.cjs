const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

app.post('/api/parse-estimate', upload.any(), async (req, res) => {
  try {
    const files = req.files || [];
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });
    const prompt = `Распознай смету. Верни JSON: {"title": "...", "items": [{"name": "", "unit": "", "quantity": 0, "price": 0, "total": 0}], "grandTotal": 0}`;
    const imageParts = files.map(f => ({ inlineData: { data: f.buffer.toString("base64"), mimeType: f.mimetype } }));
    const result = await model.generateContent([prompt, ...imageParts]);
    res.json(JSON.parse(result.response.text().replace(/```json/gi, '').replace(/```/g, '').trim()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(5001, () => console.log('Сервер запущен на 5001'));
