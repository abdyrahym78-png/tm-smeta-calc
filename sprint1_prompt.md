Role: Lead Backend & Database Architect Agents
Target Repository: https://github.com/abdyrahym78-png/tm-smeta-calc.git (Branch: main, Commit: 9041130)

Task Objective: 
Разработать и протестировать ядро бэкенда (Node.js/TypeScript + PostgreSQL + Prisma ORM) для международного мульти-стандартного сметного сервиса.

Requirements for Sprint 1:
1. Database Schema Design (Prisma / PostgreSQL):
   - Создать схему NormativeBase для поддержки нормативов (DIN, Eurocodes, FIDIC, ГЭСН/ФЕР).
   - Создать схему ClassificationMapping для привязки элементов BIM (UniClass 2015, OmniClass, IFC) к локальным расценкам.
   - Поля таблицы расценок должны поддерживать мультивалютные цены и локационные коэффициенты (country_code, region_id).

2. REST API & i18n:
   - Создать модуль локализации API (i18next) с поддержкой языков: RU, TK, EN (чтение из header Accept-Language).
   - Настроить Swagger/OpenAPI спецификацию (эндпоинты: /api/v1/standards, /api/v1/rates, /api/v1/estimates).

3. Testing & CI:
   - Написать интеграционные тесты (Jest / Supertest) для валидации выборки расценок по классификаторам.
   - Все контроллеры должны возвращать строго типизированные данные.

Constraint:
НЕ переписывать фронтенд-компоненты React из папки src/. Работать строго в директории server/.

Deliverables:
- Полный код сервера в отдельной папке server/
- Файл prisma/schema.prisma
- Генерация Swagger docs по адресу /docs
- Проходящие unit-тесты (npm run test)
