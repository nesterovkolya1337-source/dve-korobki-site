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

## Resume without chat history

Read `START_HERE.md` and `CURRENT_STATE.md`, then check the actual repository/branch and unfinished changes. `PROJECT_CONTEXT.md` is the brief, `CHAT_HISTORY.md` is dated evidence, and `BACKLOG.md` is the work queue. Do not load every historical document for every small change.

Work in small complete stages. Update the state and session log after a stage. Report separately: implemented in source, verified locally, checked in CI, published, verified at the published URL. Reuse successful checks while their inputs remain unchanged. Preserve existing owner authorization; these documents do not revoke it or authorize unrelated actions.

## Current pipeline

- Source of truth: `nesterovkolya1337-source/dve-korobki-site`.
- Runtime: dependency-free static Node.js builder, Node 20+; CI Node 22.
- `npm run check` performs validation, build and QA. Do not modify `dist/` manually.
- PRs run checks and upload an artifact. They do not deploy a live Pages preview.
- Push to `main` publishes through `.github/workflows/pages.yml`; distinguish a documentation-only rebuild from a visual/code release.
- Keep the last successful commit/deployment identifiable. For rollback, prefer a reviewed revert commit; do not force-push shared history.
- Real form submissions can send email. Use a local stub for routine testing; preserve the existing requirement for approval before a real submission.

## Codex project setup

Use the existing repository, not a new repository or a ZIP copy. Select a branch deliberately: `main` for baseline work, the recorded PR branch to continue unfinished work. No new API key, paid service, database or ecommerce backend is required for the current site build.

Documentation reference: [OpenAI — Projects and chats](https://learn.chatgpt.com/docs/projects). Keep durable project guidance in AGENTS.md and versioned documents; each chat still has its own transcript. Old chats were not imported. The separately verified Codex Cloud environment and first task are recorded in START_HERE.md and CURRENT_STATE.md.
