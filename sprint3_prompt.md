Role: Lead Backend & Database Architect Agents
Target Repository: https://github.com/abdyrahym78-png/tm-smeta-calc.git (Branch: main)

Task Objective:
Разработать модуль сопоставления BIM-классификаторов, генератор экспорта/импорта смет (CSV/JSON/Excel-compatible) и подсистему региональных коэффициентов.

Requirements for Sprint 3:
1. BIM Mapping Engine (server/src/services/bimMapper.ts):
   - Реализовать автоматическое сопоставление кодов UniClass 2015, OmniClass и IFC элементов к локальным расценкам из NormativeBase.
   - Поддержка неточного поиска (fallback) по родительским категориям классификатора.

2. Import/Export Engine (server/src/services/exporter.ts):
   - Реализовать экспорт сметы в форматы JSON, CSV и HTML/Excel таблицу.
   - Реализовать парсер для импорта смет из CSV и JSON.

3. Location Coeffs Subsystem (server/src/services/locationService.ts):
   - Добавить справочник региональных коэффициентов Туркменистана и мировых регионов (Ашхабад: 1.0, Велаяты: 1.05 - 1.15, международные коэффициенты).

4. API & Swagger Update:
   - Эндпоинты: /api/v1/bim/map, /api/v1/estimates/:id/export, /api/v1/estimates/import.
   - Обновить Swagger OpenAPI спецификацию.

5. Testing:
   - Написать unit-тесты (Jest) для BIM mapper и сервисов экспорта/импорта.

Constraint:
НЕ переписывать фронтенд-компоненты React из папки src/. Работать строго в директории server/.

Deliverables:
- Модули server/src/services/{bimMapper.ts, exporter.ts, locationService.ts}
- Маршруты server/src/routes/{bim.ts, export.ts}
- Проходящие unit-тесты (npm run test)
