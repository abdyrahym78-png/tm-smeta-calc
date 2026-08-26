Role: Lead Fullstack Architect Agents
Target Repository: https://github.com/abdyrahym78-png/tm-smeta-calc.git (Branch: main)

Task Objective:
Интегрировать React-фронтенд (папка src/) с разработанным бэкенд-ядром (server/), настроить единый API-клиент и проверить сквозную работоспособность сервиса через Docker.

Requirements for Sprint 5:
1. Frontend API Client (src/services/api.ts):
   - Создать единый клиент на базе Axios/Fetch для связи с бэкендом (/api/v1).
   - Поддержка авторизации (передача JWT-токена в заголовке Authorization).

2. UI Integration:
   - Подключить формы создания проектов и смет к эндпоинтам /api/v1/projects и /api/v1/estimates.
   - Подключить модуль BIM-сопоставления и экспорта/импорта к интерфейсным кнопкам.

3. End-to-End Verification (Docker Compose):
   - Проверить совместный запуск базы данных PostgreSQL, бэкенда и фронтенда через docker-compose.

Constraint:
Соблюдать структуру проекта. Не нарушать логику существующих компонентов в src/.

Deliverables:
- API-клиент в фронтенде (src/services/api.ts)
- Интегрированные компоненты сметного калькулятора
- Проверенный сценарий docker-compose up
