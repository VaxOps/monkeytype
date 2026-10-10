Be extremely concise. Sacrifice grammar for concision.
Frontend is partially migrated from vanilla JS to SolidJS — new components use `.tsx`, legacy code remains vanilla.
Single test file: `pnpm vitest run path/to/test.ts`
When running oxc lint, always use `--format agent`.
For typechecking, use `pnpm oxlint --type-aware --type-check` instead of `tsc`.
For styling, use Tailwind CSS, class property, `cn` utility. Do not use classlist. Only colors available are those defined in Tailwind config.
In legacy code, use `i` tags with FontAwesome classes. In new code, use `Fa` component.
In plan mode, before writing up a plan, ask clarifying questions if needed. At the end of plan mode, give me a list of unresolved questions to answer, if any. Make them concise.

## PromptPractice: build, deploy and verify locally

- Visible name: `PromptPractice`. Existing package names, Docker services/image tags, database/session identifiers and real external URLs retain their upstream identities. Preserve contributor credits.
- Work on `codex/promptpractice-vax`. User authorized pushing to fork remote `vaxops` (`VaxOps/monkeytype`). Do not create an upstream PR or push to `origin`.
- Easter eggs: standard `english` time/word tests can inject `vax` with probability `0.002` per word, excluding challenges/funboxes and nearby repeats. Repeated tests preserve their text. The top accent banner appears every page load, can be dismissed with the right-side X until reload, and uniformly chooses one of 21 approved messages per page load (16 developer/typing-practice + five vax defaults). Navigation and new/repeated tests preserve the banner message and dismissal; sentences never enter vocabulary. Removed sentence: `accuracy first. blaming dns second.` Ads, video-ad scripts/slots/commands, enable-ad controls and merch banner are removed. Confirm proposed easter egg changes with the user before implementing.
- Banner messages: fixed practice text lives in `frontend/src/ts/constants/practice-banner-messages.ts`; `VAX_BANNER_MESSAGES` supplies additional frontend build-time JSON strings, passed through Compose build args, Docker builder environment, Turbo build/dev environment and the Vite virtual config. Unset/blank uses five approved vax defaults; `[]` removes only vax messages, retaining the 16 practice messages; invalid values fail the build. Optional template: `docker/example.local.env`. Copy to `docker/.env`, edit, then use `docker compose --env-file docker/.env -f docker/docker-compose.local.yml build` and the matching `up -d --no-build --wait --wait-timeout 180`. Changes require rebuild/redeploy. Default vax sentence share is 5/21. Header subtext is raised 6px above the capital letters.
- Docker Desktop must be running in Linux-container mode. From the repository root:

```sh
# Builds the final frontend AND backend images from the current checkout.
docker compose -f docker/docker-compose.local.yml build
# Recreates changed app containers; retains MongoDB/Redis named volumes.
docker compose -f docker/docker-compose.local.yml up -d --no-build --wait --wait-timeout 180
docker compose -f docker/docker-compose.local.yml ps
```

- App: `http://localhost:8080`. Final image tags: `monkeytype-local-frontend:latest`, `monkeytype-local-backend:latest`. Both use `docker/Dockerfile.local`; targets `frontend` and `backend`. Frontend builds with `AUTH_PROVIDER=local`, `BACKEND_URL=/api`; backend runs with local authentication. Do not change just one provider.
- Changing the port requires matching `HTTP_PORT` and `BASE_URL` (e.g. `8090` and `http://localhost:8090`). Never use `down -v` for routine deployment; it deletes accounts/history. Database ports stay unpublished; HTTP binds to `127.0.0.1`.
- Check all four containers are healthy. Request `/`, `/api/`, `/api/configuration`, `/languages/english.json`, `/manifest.json`, `/images/promptpractice-social.png`; verify successful responses and PromptPractice titles/manifest. Check browser console for errors.
- Test the actual deployed app in a browser after rebuilding: reload; verify branding and no ad/merch banner or ad slots; complete a normal English typing test and inspect results; check repeat test; navigate settings/about/leaderboards; verify session restoration and local account API. Use synthetic accounts for credential tests; preserve existing users/history. Check the top banner across reloads, during typing, through navigation and in desktop/mobile layouts; its right-side X must dismiss it until the next page load. Unit tests cover all 21 selections, removed text, custom/empty vax lists and excluded word modes, without adding a production switch to force an easter egg.
- Relevant single-file checks:

```sh
pnpm vitest run frontend/__tests__/test/vax-easter-egg.spec.ts
pnpm vitest run frontend/__tests__/test/words-generator.spec.ts
pnpm vitest run frontend/__tests__/elements/vax-banner.spec.ts
pnpm vitest run frontend/__tests__/vite-plugins/vax-banner-config.spec.ts
pnpm vitest run frontend/__tests__/root/config-metadata.spec.ts
pnpm oxlint --type-aware --type-check --format agent
```

- Export frontend/backend images for transfer with `docker save -o promptpractice-app-images.tar monkeytype-local-frontend:latest monkeytype-local-backend:latest`; import with `docker load -i promptpractice-app-images.tar`. A fresh/offline deployment also needs `mongo:5.0.13` and `redis:6.2.6`. Keep image archives and screenshots outside Git.

### Verified deployment: 10 October 2026

- Built both images with Compose; deployed with `up -d --no-build --wait --wait-timeout 180`. Frontend/backend/MongoDB/Redis healthy; existing volumes and local session survived. Site: `http://localhost:8080`.
- All seven HTTP checks above returned 200. Manifest/title/API docs show PromptPractice. Same-origin CSP present. Full `pnpm oxlint --type-aware --type-check --format agent` passed after removing an unnecessary assertion in the root Vitest config. Relevant tests: 103 passed across five files (12 word-chance, 3 generator/repeat, 3 banner, 55 metadata, 30 configuration).
- Browser: yellow banner appeared naturally on third reload and closed correctly; zero ad slots. `vax` appeared at word index 9 after four fresh tests; phrase absent from words. Completed English time-15 test: 61.56 WPM, 100% accuracy; saved to the existing `OfflineTester` profile and verified in the daily leaderboard. Repeat matched all original words. Settings/About/all-time and daily leaderboards worked. Desktop/mobile layouts checked; no browser-console errors.
- Export: `C:/Users/user/projects/promptpractice-artifacts/promptpractice-app-images.tar` (frontend/backend only). Screenshots in the same directory: `promptpractice-banner.jpg`, `promptpractice-vax-word.jpg`, `promptpractice-result.jpg`, `promptpractice-mobile.jpg`. No images published or upstream PR created.

### Verified follow-up: 10 October 2026

- User approved all five proposed sentences before implementation; subsequently requested 10% instead of 25%. Defaults: `vax types faster than his shadow.`, `the spacebar works overtime for vax.`, `vax called. your keyboard wants a rematch.`, `somewhere, vax just broke the sound barrier.`, `this keyboard has been blessed by vax.`
- Rebuilt both images with `docker compose -f docker/docker-compose.local.yml build`; deployed with the documented `up` command. All four containers healthy; five HTTP routes (`/`, `/api/`, `/api/configuration`, `/languages/english.json`, `/manifest.json`) returned 200. Existing local session restored. Compose's explicit example environment forwards all five messages. Relevant tests: 9 banner + 12 environment parsing passed; full lint/typecheck passed. Tests cover the exact 10% boundary, all five selections, custom/empty lists and invalid JSON/value rejection.
- Actual browser: header subtext raised 6px and visibly clears capitals at desktop size; mobile layout checked. New banner appeared naturally on the second verification reload, survived navigation to settings, and dismissed correctly. Zero ad slots; no console errors. Completed English words-10 test: 149.67 WPM, 100% accuracy; repeat matched all ten words. Restored time-15 mode and default viewport.
- Refreshed image archive: `C:/Users/user/projects/promptpractice-artifacts/promptpractice-app-images.tar`, 148414464 bytes; SHA256 `FC15FE041B44BE9C549236F4E144BE251EBBD49B451AF3D8E92D0573DC30E88A`. New screenshots: `promptpractice-banner-10-percent.jpg`, `promptpractice-result-updated.jpg`, `promptpractice-mobile-updated.jpg`. No push or PR.

### Verified persistent banner: 10 October 2026

- User approved the reviewed list by requesting deployment, removing sentence 15 (`accuracy first. blaming dns second.`). Final default pool: 16 developer/typing-practice messages + five existing vax messages = 21. Banner now shows every page load, stays during typing/navigation/results/repeats, and has no close button. `VAX_BANNER_MESSAGES=[]` retains the fixed 16 practice messages.
- Built frontend/backend via `docker compose -f docker/docker-compose.local.yml build`, deployed with `up -d --no-build --wait --wait-timeout 180`; all four services healthy. The six HTTP routes listed above returned 200. Exported both images again; database volumes and existing local session preserved. Tests: 26 banner + 12 environment parsing passed; full `pnpm oxlint --type-aware --type-check --format agent` passed.
- Browser: four reloads all showed a banner, with both practice and vax text observed. Yellow background `rgb(226,183,20)`, no close button. Message stayed through settings/account/about/leaderboard navigation and during typing/results/repeat. English words-10 test: 129.94 WPM, 100% accuracy; verified saved row in OfflineTester history and all ten repeat words. Desktop/mobile checked; mobile wrapped banner to 56px, header started at 68px, no horizontal overflow. No ad slots or console errors. Restored time-15 mode/default viewport.
- Archive: `C:/Users/user/projects/promptpractice-artifacts/promptpractice-app-images.tar`, 148413952 bytes, SHA256 `A544F3D404F5FE42969F0F0EFF199364349D3088B55923FF7814668AF571E941`. Screenshots: `promptpractice-persistent-banner.jpg`, `promptpractice-banner-during-typing.jpg`, `promptpractice-persistent-result.jpg`, `promptpractice-persistent-mobile.jpg`. Push only to `vaxops/codex/promptpractice-vax`; no PR.

### Verified dismissible banner: 10 October 2026

- Restored the right-side X after clarifying that appearing on every page load should still allow dismissal. The existing close button now has the accessible name `Dismiss banner`. The 21 approved sentences and `VAX_BANNER_MESSAGES` behavior are unchanged. Dismissal lasts through navigation/new tests until reload.
- Built both images with `docker compose -f docker/docker-compose.local.yml build`; deployed with `up -d --no-build --wait --wait-timeout 180`. All four containers healthy; six documented HTTP routes returned 200. Existing local session and database volumes preserved. All 26 banner tests and full `pnpm oxlint --type-aware --type-check --format agent` passed.
- Actual browser: desktop X dismissed the banner and reclaimed its 36px offset; dismissal survived settings/home navigation, restart and typing. Reload restored it. Mobile X worked on a 56px wrapped banner, without horizontal overflow. No ad slots or console errors. Restored time-15 mode/default viewport. Screenshots: `promptpractice-dismissible-banner.jpg`, `promptpractice-dismissible-mobile.jpg` in the artifact directory.
- Refreshed frontend/backend archive: `C:/Users/user/projects/promptpractice-artifacts/promptpractice-app-images.tar`, 148414464 bytes; SHA256 `9BC17427C3C2E7D4C084CF00653DD50434EE51129E598B976C3856916C8BA1CE`. Push only to the authorized vaxops branch; no upstream push or PR.
