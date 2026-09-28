# AGENTS.md — Две Коробки

You are working on the production website for **Две Коробки**, a specialised DSG / S-Tronic / PowerShift / DCT repair service.

## Start and resume

- This repository is **ДВЕ КОРОБКИ**, not ASAYA. Reply to the owner in Russian, briefly and concretely.
- At a new session, read `START_HERE.md` and `docs/CURRENT_STATE.md`, then inspect the current branch, dirty files and relevant open PR. Read other documents only as needed.
- Continue the existing implementation. Do not restart the site or replace its framework because a new chat lacks history.
- `docs/PROJECT_CONTEXT.md` holds the project brief; `docs/CHAT_HISTORY.md` distinguishes owner decisions from historical assistant claims and uncertain proposals.
- `docs/BACKLOG.md` is the continuation queue; `docs/ASAYA_LESSONS.md` transfers workflow experience, not ecommerce features.
- At the end of a completed stage, update `docs/CURRENT_STATE.md` and append a short entry to `docs/SESSION_LOG.md` with checks, publication status and next action.

## Primary goal

Convert the approved Figma handoff into a fast, responsive, accessible and SEO-ready static site, while preserving the current design system.

## Sources of truth

1. `docs/FIGMA_HANDOFF.md` — exact desktop/mobile frames and node IDs.
2. `content/business.json` — business data.
3. `content/pages.json` — routes and page content.
4. `docs/ASSETS_MANIFEST.md` — asset status and rights.
5. Figma file `I3VjCQVEO11bDEw2Gf4HOd` — visual design.

## Context and authority

The owner's current instructions take precedence. Use current source and service state to establish what is implemented; do not treat a historical assistant promise, a generated preview or a passed build as proof of deployment. Preserve existing approval boundaries in `docs/CODEX_WORKFLOW.md`; reuse authorization already supplied in the session.

## Non-negotiable rules

- Do not redesign approved layouts without an explicit task. Preserve existing homepage sections.
- Specialization is DSG / S-Tronic / PowerShift / Chinese DCT and dual-mass flywheels, not all automatic transmissions or CVTs.
- Use real supplied or authorized gearbox photography. Do not reintroduce AI-generated gearboxes as technical product photos.
- Keep prices, warranty and address confirmation flags intact until confirmed by the owner.
- Do not migrate to the ASAYA stack or add cart, SMS login, payments, warehouse or shipping workflows without a specific task.
- Do not implement hidden/archive Figma frames.
- Never hard-code phone, address, prices or warranty in templates.
- Do not use a competitor image without a licence or permission.
- Do not call a generic/AI image a specific gearbox model unless verified.
- Preserve trailing-slash routes.
- Mobile target width is 390 px; desktop target width is 1440 px.
- Every change must pass `npm run check`. Run it once for the completed change set; repeat only after relevant input changes or to resolve a concrete risk. Do not equate build QA with browser QA or successful form delivery.
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
