require('dotenv').config();
const fs = require('fs');
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('❌ Ошибка: GEMINI_API_KEY не найден в файле .env!');
  console.log('👉 Сначала сохраните ключ командой: echo "GEMINI_API_KEY=ваш_ключ" > .env');
  process.exit(1);
}

console.log('🤖 Агент X: Установка связи с Google AI Studio (gemini-3.6-flash)...');

const payload = JSON.stringify({
  contents: [
    {
      role: 'user',
      parts: [
        {
          text: `Сгенерируй тестовую смету на отделку офиса 50 кв.м.
{
  "project_type": "apartment_renovation",
  "standard": "FIDIC",
  "currency": { "base": "USD", "target": "TMT", "exchange_rate": 19.5, "inflation_index": 1.0 },
  "tax_logistics": { "vat_percent": 15, "customs_duty_percent": 0, "regional_coeff": 1.0 },
  "language": "ru"
}`
        }
      ]
    }
  ],
  systemInstruction: {
    parts: [
      {
        text: "Ты — международный ИИ-эксперт сметного API. Возвращай результат СТРОГО в формате валидного JSON без markdown-тегов."
      }
    ]
  }
});

const url = new URL(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${API_KEY}`);

const options = {
  hostname: url.hostname,
  path: url.pathname + url.search,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const jsonRes = JSON.parse(responseData);
        const textResult = jsonRes.candidates[0].content.parts[0].text;
        console.log('✅ Связь с Google AI Studio успешно установлена!');
        console.log('\n--- Ответ ИИ-Ядра (Antigravity Output) ---');
        console.log(textResult);
      } catch (e) {
        console.log('⚠️ Ответ получен, но ошибка при парсинге JSON:', responseData);
      }
    } else {
      console.error(`❌ Ошибка подключения AI Studio (Статус: ${res.statusCode}):`, responseData);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Сетевая ошибка соединения:', e.message);
});

req.write(payload);
req.end();
