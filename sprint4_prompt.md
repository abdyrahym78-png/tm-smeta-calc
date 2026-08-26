Role: Lead Backend & Database Architect Agents
Target Repository: https://github.com/abdyrahym78-png/tm-smeta-calc.git (Branch: main)

Task Objective:
Реализовать модуль аутентификации (JWT/RBAC), сервис генерации официальных печатных форм смет (PDF) и Docker-окружение для развертывания PostgreSQL.

Requirements for Sprint 4:
1. Authentication & RBAC (server/src/middleware/auth.ts & server/src/routes/auth.ts):
   - Реализовать авторизацию по JWT (роли: ADMIN, ENGINEER, CLIENT).
   - Защита эндпоинтов создания/редактирования смет для авторизованных пользователей с ролью ENGINEER или ADMIN.

2. PDF Printable Report Generator (server/src/services/pdfExporter.ts):
   - Создать сервис генерации печатного отчета/акта сметы (HTML/PDF-ready шаблон с реквизитами, подписями и детализацией позиций).

3. Containerization & Database Setup (docker-compose.yml & server/Dockerfile):
   - Добавить docker-compose.yml с PostgreSQL 16 и сервисом приложения.
   - Подготовить скрипты миграции Prisma для развертывания в продуктивной среде.

4. API & Swagger Update:
   - Добавить эндпоинты: /api/v1/auth/login, /api/v1/estimates/:id/pdf.
   - Обновить Swagger OpenAPI документацию.

5. Testing:
   - Написать unit-тесты (Jest) для проверки JWT авторизации и генерации PDF-структур.

Constraint:
НЕ переписывать фронтенд-компоненты React из папки src/. Работать в директории server/ и корне проекта (docker-compose.yml).

Deliverables:
- Модули авторизации и роли (server/src/middleware/auth.ts)
- Сервис генерации PDF/HTML отчетов (server/src/services/pdfExporter.ts)
- Файлы docker-compose.yml и server/Dockerfile
- Проходящие unit-тесты (npm run test)
