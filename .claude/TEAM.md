# sapardo10 site team rules

Shared model: `~/.claude/team-kit/README.md` and `LEARNINGS.md`. This file holds only what is specific to the portfolio site (https://sapardo10.github.io). Runtime state: `~/.claude/sapardo10-team/`. Memory: `project_sapardo10_portfolio.md`.

## Stack
- Vanilla HTML/CSS/JS, no build, GitHub Pages. Bilingual ES/EN via `class="lang" data-es/data-en` + `setLanguage()` in `script.js` (localStorage). Nav and footer are injected by `script.js` into `#site-nav` / `#site-footer` and auto-prefixed `../` for subfolder pages. Per-app pages theme through `--app-accent`, `--app-accent-2`, `--app-accent-soft`.
- Structure: `apps/<slug>.html`, `support/<slug>.html` (Play/App Store support URL), `privacy/<slug>.html` (privacy URL), `terms/`. Icons `assets/images/apps/<slug>.png`. `app-ads.txt` at root is live ad config.

## Hard rules
- Store listings point at these URLs (support, privacy, terms): never rename or delete a published page path.
- Live Play ids: stampway com.iziapps.stampway, walkcast com.walkcast.walkcast, pingpartner com.iziapps.pingpartner, triplist com.iziapps.triplist (NOT `.pro`), pausactive com.iziapps.pausactive.pausactive.
- Support emails are plus-addressed `carnifis+<slug>@gmail.com`. Privacy pages must match what each app really collects; a privacy change needs the owner's OK. `app-ads.txt` edits: owner's OK.
- Every change to both languages together.

## Local CI (the merge gate)
- Command: `tool/ci.sh` (added by this team): `node --check` on the root JS files and a non-empty `app-ads.txt` check. No CI config exists and there is no build. Real verification is opening the changed page(s) in a browser at phone and desktop width, ES and EN; do that for any HTML/CSS change.

## Merge and release
- Merge path today: owner commits go straight to `main` and push (any push to `main` deploys via Pages, so a push is a public release). Earlier work arrived as `claude/*` PRs (#1–#4) merged on the remote.
- GOTCHA: remote `main` can receive auto-merged PRs. Always `git fetch origin` and rebase/merge `origin/main` before pushing, or the branch diverges.
- Default: local squash-merge + push `main` only with the owner's OK in chat for each push (it publishes). Local CI PASS + Reviewer GO on one SHA first.

## Devices
- None. Preview with a local static server (`python3 -m http.server`) in the worktree.

## Skills
Dev: investigate. Reviewer: review. Design-sensitive pages: design-review.

## Commit format
`<type>(<scope>): <description>` (e.g. `feat(stemstudio): app, terms and support pages`).
