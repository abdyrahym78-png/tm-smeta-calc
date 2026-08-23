const fs = require('fs');
const https = require('https');

const API_KEY = process.argv[2] || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ Ошибка: Вы не указали API-ключ!");
  console.log("Пример запуска: node auto_builder.cjs AIzaSyВашКлюч");
  process.exit(1);
}

const promptText = `
Напиши с нуля полный, готовый к работе React-компонент (src/App.jsx) для приложения "Сметный ИИ-Сервис («Сайт Х»)".

ТОЧНОЕ СООТВЕТСТВИЕ ДИЗАЙНУ И ИНТЕРФЕЙСУ (UI):
1. ШАПКА И НАСТРОЙКИ:
   - Заголовок: "Сметный ИИ-Сервис («Сайт Х»)"
   - Подзаголовок: "Расчет ремонта по фото, ИИ-квизу или сметному документу"
   - Селекторы: "🌐 Язык отчета" (RU/TM/EN), "🔱 Валюта" (TMT/USD), "🔑 API Key" (input).

2. ТРИ ВКЛАДКИ РЕЖИМА (Tabs):
   - ⚡ ИИ-Квиз за 15 сек
   - 📷 Смета по фото
   - 📁 Загрузить файл (с мультизагрузкой .pdf, .png, .jpg)

3. ПАРАМЕТРЫ И ФИЛЬТРЫ:
   - "🏢 Тип объекта": Селект (Квартира, Высотное здание, Офис, Частный дом).
   - "📐 Площадь": Интерактивный слайдер (range 10-1000 м²) с выводной цифрой.
   - "⚒️ Класс ремонта": Интерактивные кнопки переключения (🟢 Косметический, 🔵 Капитальный, 🟣 Дизайнерский).
   - "✅ Включенные работы": Кнопки-чекбоксы (🧱 Стены, 💡 Электрика, 🚰 Сантехника, 🪵 Полы, ☁️ Потолки).

4. РАСЧЕТ И ИИ:
   - Кнопка: "✨ Сгенерировать смету через ИИ" (синяя, во всю ширину).
   - Смета адаптируется под тип объекта: для высоток — монолит, фундамент, сети; для квартир — отделка, электрика, сантехника.
   - Все суммы защищены: (Number(val) || 0). Никаких NaN или 0.00 TMT!

5. ТАБЛИЦА РЕЗУЛЬТАТОВ И ЭКСПОРТ:
   - Контейнер таблицы с горизонтальной прокруткой (overflowX: 'auto', minWidth: '650px').
   - Нижний блок кнопок: "Копировать" (для IMO/Telegram), "Excel" (.xlsx), "QR-код", "Договор".

Верни ТОЛЬКО чистый JSX-код без markdown-пояснений!
`;

const payload = JSON.stringify({
  contents: [{ parts: [{ text: promptText }] }]
});

const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1beta/models/gemini-3.6-flash:generateContent?key=${API_KEY}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

console.log("🚀 Agent X запрашивает обновление App.jsx через gemini-3.6-flash...");

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const response = JSON.parse(data);

      if (response.error) {
        console.error("❌ Ошибка от Google API:", response.error.message || response.error);
        return;
      }

      if (!response.candidates || !response.candidates[0]) {
        console.error("❌ Ответ API не содержит кандидатов:", JSON.stringify(response));
        return;
      }

      let code = response.candidates[0].content.parts[0].text;
      code = code.replace(/```jsx/g, '').replace(/```javascript/g, '').replace(/```/g, '').trim();

      fs.writeFileSync('src/App.jsx', code);
      console.log("✅ Успешно! Файл src/App.jsx полностью обновлен со всем UI.");
    } catch (err) {
      console.error("❌ Ошибка при парсинге ответа:", err.message);
      console.log("Сырой ответ сервера:", data);
    }
  });
});

req.on('error', (e) => console.error("❌ Ошибка сети:", e.message));
req.write(payload);
req.end();
