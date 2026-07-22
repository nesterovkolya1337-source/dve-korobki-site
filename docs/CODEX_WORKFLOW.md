# Codex workflow

## Default task format

```text
Implement [route] using the exact Figma frames from docs/FIGMA_HANDOFF.md.
Use content JSON; do not hard-code business data.
Run npm run check.
Return: changed files, QA result, remaining data blockers, preview path.
```

## Rules for autonomous changes

Codex may:

- improve reusable components;
- update content JSON;
- replace approved assets;
- fix responsive and accessibility issues;
- add tests and documentation.

Codex must ask before:

- deleting routes or assets;
- changing legally meaningful warranty/price claims;
- publishing to a custom domain;
- connecting paid services;
- sending real form submissions.

## Branch convention

- `feat/<route-or-component>`
- `fix/<issue>`
- `assets/<subject>`
- `content/<topic>`

Every pull request must run the workflow and pass `npm run check`.
