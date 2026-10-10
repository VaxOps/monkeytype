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
- Work on `codex/promptpractice-vax`. Do not create an upstream PR or push to `origin`.
- Easter eggs: standard `english` time/word tests can inject `vax` with probability `0.002` per word, excluding challenges/funboxes and nearby repeats. Repeated tests preserve their text. `vax is the goat` is a dismissible top accent banner, probability `0.05` per page load; never vocabulary. Ads, video-ad scripts/slots/commands, enable-ad controls and merch banner are removed. Confirm proposed easter egg changes with the user before implementing.
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
- Test the actual deployed app in a browser after rebuilding: reload; verify branding and no ad/merch banner or ad slots; complete a normal English typing test and inspect results; check repeat test; navigate settings/about/leaderboards; verify session restoration and local account API. Use synthetic accounts for credential tests; preserve existing users/history. Check the rare top banner naturally across reloads, its close button and layout. Unit tests cover exact chance boundaries and excluded modes, without adding a production switch to force an easter egg.
- Relevant single-file checks:

```sh
pnpm vitest run frontend/__tests__/test/vax-easter-egg.spec.ts
pnpm vitest run frontend/__tests__/test/words-generator.spec.ts
pnpm vitest run frontend/__tests__/elements/vax-banner.spec.ts
pnpm vitest run frontend/__tests__/root/config-metadata.spec.ts
pnpm oxlint --type-aware --type-check --format agent
```

- Export frontend/backend images for transfer with `docker save -o promptpractice-app-images.tar monkeytype-local-frontend:latest monkeytype-local-backend:latest`; import with `docker load -i promptpractice-app-images.tar`. A fresh/offline deployment also needs `mongo:5.0.13` and `redis:6.2.6`. Keep image archives and screenshots outside Git.

### Verified deployment: 10 October 2026

- Built both images with Compose; deployed with `up -d --no-build --wait --wait-timeout 180`. Frontend/backend/MongoDB/Redis healthy; existing volumes and local session survived. Site: `http://localhost:8080`.
- All seven HTTP checks above returned 200. Manifest/title/API docs show PromptPractice. Same-origin CSP present. Full `pnpm oxlint --type-aware --type-check --format agent` passed after removing an unnecessary assertion in the root Vitest config. Relevant tests: 103 passed across five files (12 word-chance, 3 generator/repeat, 3 banner, 55 metadata, 30 configuration).
- Browser: yellow banner appeared naturally on third reload and closed correctly; zero ad slots. `vax` appeared at word index 9 after four fresh tests; phrase absent from words. Completed English time-15 test: 61.56 WPM, 100% accuracy; saved to the existing `OfflineTester` profile and verified in the daily leaderboard. Repeat matched all original words. Settings/About/all-time and daily leaderboards worked. Desktop/mobile layouts checked; no browser-console errors.
- Export: `C:/Users/user/projects/promptpractice-artifacts/promptpractice-app-images.tar` (frontend/backend only). Screenshots in the same directory: `promptpractice-banner.jpg`, `promptpractice-vax-word.jpg`, `promptpractice-result.jpg`, `promptpractice-mobile.jpg`. No images published or upstream PR created.
