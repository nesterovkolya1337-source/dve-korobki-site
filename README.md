# Две Коробки

Существующий сайт сервиса DSG / S-Tronic / PowerShift / DCT и двухмассовых маховиков. **Начало работы и память проекта: [START_HERE.md](START_HERE.md).**

## Продолжение в Codex

Открой этот репозиторий, прочитай `AGENTS.md` и `docs/CURRENT_STATE.md`. Решения из доступных чатов и опыт работы над ASAYA сохранены в документах рядом с кодом. Это не перенос переписок в интерфейс Codex; рабочий контекст доступен даже в новом чате.

- Репозиторий: [nesterovkolya1337-source/dve-korobki-site](https://github.com/nesterovkolya1337-source/dve-korobki-site).
- Настроенный адрес сайта: [GitHub Pages](https://nesterovkolya1337-source.github.io/dve-korobki-site/).
- Фотоэтап: [PR #1](https://github.com/nesterovkolya1337-source/dve-korobki-site/pull/1); статус сверять перед продолжением.
- Дизайн: [Figma](https://www.figma.com/design/I3VjCQVEO11bDEw2Gf4HOd/Untitled), точные кадры в `docs/FIGMA_HANDOFF.md`.

## Запуск

Нужен Node.js 20+; GitHub CI использует Node.js 22. Внешних runtime-зависимостей нет.

```bash
npm run check
npm run dev
```

Открыть `http://localhost:4321`. Отдельные команды: `npm run validate`, `npm run build`, `npm run qa`, `npm run preview`.

## Структура

| Путь | Содержимое |
|---|---|
| `content/` | Бизнес-данные, 22 страницы, навигация |
| `src/lib/` | Общие шаблоны, HTML helpers и SVG-иконки |
| `src/styles/` | Общие стили и адаптив |
| `src/scripts/` | Меню и клиентское поведение формы |
| `public/` | Логотипы, изображения, статические файлы |
| `scripts/` | Генератор, валидация, QA, локальный сервер |
| `docs/` | Контекст, история, статус, backlog и карта дизайна |
| `.github/workflows/pages.yml` | Проверки PR и публикация main |
| `dist/` | Результат сборки; не редактировать вручную |

## Публикация и состояние

Push в `main` запускает GitHub Actions с публикацией на GitHub Pages. PR выполняет QA и создаёт скачиваемый build artifact; это не отдельный опубликованный preview URL. Изменения в открытом PR не следует описывать как уже работающие на сайте.

Актуальная точка продолжения, известные ограничения и данные перед запуском — в [CURRENT_STATE](docs/CURRENT_STATE.md). Порядок работы и действующие ограничения — в [CODEX_WORKFLOW](docs/CODEX_WORKFLOW.md). Старые PowerShell/ZIP-пакеты остаются историческим способом передачи; обычный путь — существующий GitHub-репозиторий.
