# Struktura projektu — BeerTaste v2 🚀

Aktualna, rozszerzona dokumentacja struktury repozytorium z krótkimi opisami i poleceniami uruchomieniowymi.

---

## 🗂️ Główne pliki i katalogi w katalogu root

- `BearTaste-V2-21.01.26.md` — historyczne notatki i decyzje projektowe.
- `docker-compose.prod.yml` — konfiguracja produkcyjna (usługi, sieci, wolumeny).
- `migrate_beers.js` — skrypt migracji/importu recenzji do bazy.
- `package.json` — skrypty i zależności w workspace (root).
- `pnpm-lock.yaml` — lockfile zarządzany przez pnpm.
- `Workflow Projektu BeerTaste v2.md` — opis procesu wdrożenia i workflow.
- `beer_photos_output/` — wyeksportowane/tymczasowe zdjęcia piw.

---

## client/ — frontend (Next.js)

Opis: nowoczesny frontend w Next.js 15 z TypeScript i Tailwind.

- `Dockerfile` — obraz dla deploymentu.
- `package.json` — zależności i skrypty frontendowe (`dev`, `build`, `start`).
- `next.config.ts` — konfiguracja Next.js (np. PWA, obrazy, rewrites).
- `tsconfig.json`, `next-env.d.ts` — konfiguracja TypeScript.
- `postcss.config.mjs`, `tailwind.config.js` — konfiguracja CSS/Tailwind.
- `eslint.config.mjs` — reguły lintowania.

### Ważne katalogi w `client/`
- `client/app/` — routing i strony (Server / Client Components):
  - `layout.tsx` — globalny layout aplikacji.
  - `page.tsx` — strona główna (Server Component).
  - `globals.css` — globalne style.
- `client/src/` (zalecane) — kod źródłowy:
  - `components/` — powtarzalne UI (Button, Card, BeerCard).
  - `lib/` — klienci i helpery (np. `supabase.ts`).
  - `store/` — Zustand store (`useBeerStore.ts`).
  - `types/` — wygenerowane typy Supabase (`src/types/supabase.ts`).
  - `styles/` — lokalne style i tokeny.
- `client/public/` — statyczne pliki: manifest, ikony, obrazy.

---

## Infrastruktura / Dane / Skrypty

- `migrate_beers.js` — import/transformacja danych (CSV → DB).
- `beer_photos_output/` — output procesu przygotowania zdjęć.
- Supabase (self-hosted) — baza PostgreSQL + Storage.
- `docker-compose.prod.yml` — orchestracja usług (np. Supabase, reverse-proxy).

---

## Rekomendowane dodatkowe pliki / katalogi
- `.env.example` — przykładowe zmienne środowiskowe (bez sekretów).
- `docs/` lub `wiki/` — rozbicie roadmapy na odrębne strony (Faza 1..5).
- `.github/workflows/` — workflowy CI/CD (lint, test, build, deploy).
- `tests/` — testy jednostkowe/integracyjne (np. Vitest, Playwright).
- `contributing.md` — instrukcja dla współpracowników.

---

## Jak uruchomić projekt lokalnie (szybki start)

1. Sklonuj repo i zainstaluj zależności (pnpm):

```bash
git clone <repo>
pnpm install
```

2. Skonfiguruj `.env.local` w `client/` (przykład w `.env.example`).

3. Uruchom frontend w trybie deweloperskim:

```bash
cd client
pnpm dev
```

4. Jeżeli potrzebujesz lokalnego Supabase - uruchom kontenery lub punktuj na self-hosted (instrukcje w `README` lub `docs/`).

---

## ✅ Checklist (sugerowane zadania do wykonania)

- [x] Zainicjalizować TypeScript i wygenerować typy Supabase
- [x] Skonfigurować Supabase client (`src/lib/supabase.ts`)
- [ ] Dodać `.env.example`
- [ ] Dodać CI workflow (lint, test, build)
- [ ] Rozbić roadmapę na pliki w `docs/` lub Wiki.js
- [ ] Dodać testy e2e dla głównej ścieżki (dodawanie recenzji, upload zdjęcia)

---

## Propozycje następnych kroków
- Dodać `docs/` z rozbiciem roadmapy na fazy i checklistami.
- Utworzyć `ISSUE_TEMPLATE` i `PULL_REQUEST_TEMPLATE` w `.github/`.
- Dodać skrypt `pnpm run format` i `pnpm run lint:fix` do root `package.json`.

---

Jeżeli chcesz, mogę teraz:
- dodać te zmiany do repo i zrobić commit + push ✅
- rozbić `docs/` na pliki `phase-1.md` ... `phase-5.md` 🔀

Powiedz, którą opcję wykonać.