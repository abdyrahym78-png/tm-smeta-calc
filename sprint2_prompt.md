Role: Lead Backend & Database Architect Agents
Target Repository: https://github.com/abdyrahym78-png/tm-smeta-calc.git (Branch: main)

Task Objective:
Разработать расчетный движок сметного сервиса, полнофункциональный CRUD для смет/проектов и расширить схему базы данных Prisma.

Requirements for Sprint 2:
1. Database Schema Expansion (Prisma / PostgreSQL):
   - Добавить модель Project (id, name, client, regionId, createdAt).
   - Добавить модель Estimate (id, projectId, title, totalAmount, currency, createdAt).
   - Добавить модель EstimateItem (id, estimateId, rateId, quantity, unitPrice, locationCoeff, taxRate, overheadCoeff, totalPrice).

2. Calculation Engine (server/src/engine/calculator.ts):
   - Реализовать функцию расчета позиции и всей сметы с учетом количества, базовых расценок, накладных расходов, НДС и коэффициентов региона.
   - Поддержка конвертации мультивалютных итогов (TMT, USD, EUR).

3. CRUD API & Swagger Update:
   - Реализовать маршруты и контроллеры для /api/v1/projects и /api/v1/estimates (GET, POST, PUT, DELETE).
   - Обновить спецификацию Swagger OpenAPI для новых роутов.

4. Testing:
   - Написать unit-тесты (Jest) для проверки точности расчетов калькулятора при различных региональных коэффициентах и налогах.

Constraint:
НЕ переписывать фронтенд-компоненты React из папки src/. Работать строго в директории server/.

Deliverables:
- Обновленный файл server/prisma/schema.prisma
- Модуль расчета стоимости server/src/engine/calculator.ts
- Обновленные маршруты в server/src/routes/
- Проходящие unit-тесты (npm run test)
