# AGENTS.md — Две Коробки

You are working on the production website for **Две Коробки**, a specialised DSG / S-Tronic / PowerShift / DCT repair service.

## Primary goal

Convert the approved Figma handoff into a fast, responsive, accessible and SEO-ready static site, while preserving the current design system.

## Sources of truth

1. `docs/FIGMA_HANDOFF.md` — exact desktop/mobile frames and node IDs.
2. `content/business.json` — business data.
3. `content/pages.json` — routes and page content.
4. `docs/ASSETS_MANIFEST.md` — asset status and rights.
5. Figma file `I3VjCQVEO11bDEw2Gf4HOd` — visual design.

## Non-negotiable rules

- Do not redesign approved layouts without an explicit task.
- Do not implement hidden/archive Figma frames.
- Never hard-code phone, address, prices or warranty in templates.
- Do not use a competitor image without a licence or permission.
- Do not call a generic/AI image a specific gearbox model unless verified.
- Preserve trailing-slash routes.
- Mobile target width is 390 px; desktop target width is 1440 px.
- Every change must pass `npm run check`.
- Keep the site dependency-free unless a dependency has a concrete production benefit and is approved.
- Build output is generated; never edit `dist/` manually.

## Commands

```bash
npm run validate
npm run build
npm run qa
npm run check
npm run dev
```

## Completion report

Return:

1. What changed.
2. Figma frames used.
3. Automated QA result.
4. Manual checks still needed.
5. Business-data blockers.
6. Preview URL/path.
