const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

// Обновляем промпт, чтобы он строго учитывал выбранные категории
const oldPromptRegex = /const prompt = `[\s\S]*?`;/;
const newPromptCode = `const prompt = \`Ты — профессиональный сметчик в Туркменистане. 
Сгенерируй детальную смету на ремонт в формате JSON.

Параметры заказа:
- Тип ремонта: \${repairType || 'Косметический'}
- Площадь: \${square || 50} м²
- ВКЛЮЧЕННЫЕ КАТЕГОРИИ: \${Array.isArray(categories) && categories.length > 0 ? categories.join(', ') : 'Стены, Полы'}

СТРОГОЕ ПРАВИЛО: Составляй смету ТОЛЬКО по категориям из списка ВКЛЮЧЕННЫЕ КАТЕГОРИИ (\${Array.isArray(categories) ? categories.join(', ') : 'Стены, Полы'}). Не добавляй Электрику, Потолки или Сантехнику, если их нет в этом списке!\`;`;

if (code.includes('const prompt =')) {
  code = code.replace(oldPromptRegex, newPromptCode);
  fs.writeFileSync('server.js', code);
  console.log('✅ Промпт в server.js успешно обновлен!');
} else {
  console.log('⚠️ Не удалось найти переменную prompt в server.js, проверьте структуру.');
}
