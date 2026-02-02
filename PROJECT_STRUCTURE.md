# Struktura projektu — BeerTaste v2 🚀

Aktualna, rozszerzona dokumentacja struktury repozytorium z krótkimi opisami i poleceniami uruchomieniowymi.

---

## 🗂️ Główne pliki i katalogi w katalogu root

- `BearTaste-V2-21.01.26.md` — historyczne notatki i decyzje projektowe.
- `docker-compose.yml` — konfiguracja Docker w trybie deweloperskim z volume mounting.
- `docker-compose.prod.yml` — konfiguracja produkcyjna (usługi, sieci, wolumeny).
- `Dockerfile` — obraz Docker dla aplikacji Next.js.
- `migrate_beers.js` — skrypt migracji/importu recenzji do bazy (129 rekordów).
- `migrate_photos_final.js` — skrypt migracji zdjęć z base64 do Supabase Storage (129 zdjęć JPG).
- `fix_json_urls.js` — skrypt konwersji URLi zdjęć (localhost ↔ supabase-kong).
- `package.json` — skrypty i zależności w workspace (root).
- `pnpm-lock.yaml` — lockfile zarządzany przez pnpm.
- `Workflow Projektu BeerTaste v2.md` — opis procesu wdrożenia i workflow.
- `backup/` — kopia zapasowa oryginalnych danych (reviews.json z base64).
- `src/` — źródłowe dane JSON (reviews.json z URLami zdjęć).

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
- `client/app/` — routing i strony (App Router Next.js 15):
  - `layout.tsx` — globalny layout aplikacji.
  - `page.tsx` — strona główna wyświetlająca 10 najnowszych recenzji ze zdjęciami.
  - `globals.css` — globalne style (Tailwind CSS).
  - `favicon.ico` — ikona strony.
- `client/lib/` — klienci i helpery:
  - `supabase.ts` — konfiguracja klienta Supabase.
- `client/types/` — definicje TypeScript.
- `client/public/` — statyczne pliki: manifest, ikony, obrazy.

**Uwaga:** Aplikacja obecnie nie używa Zustand ani komponentów Shadcn/UI - jest to prosty Server Component z bezpośrednim fetching z Supabase.

---

## Infrastruktura / Dane / Skrypty

### Baza danych (Supabase PostgreSQL)
- Tabela `reviews` (129 rekordów):
  - `id` (text, PK)
  - `beer_name`, `brewery`, `style` (text)
  - `ratings` (jsonb) — obiekt {aroma, taste, mouthfeel, appearance}
  - `note` (text)
  - `photo_url` (text) — URL do Supabase Storage
  - `tasting_date`, `created_at` (timestamp)
  - `user_id` (text)

### Storage (Supabase Storage)
- Bucket: `beer-photos` (public)
- 129 zdjęć JPG (~171KB każde)
- Format ścieżki: `beer-photos/{review_id}.jpg/{uuid}.jpg`

### Skrypty migracji
- `migrate_beers.js` — import recenzji z JSON do bazy (wykonany ✅).
- `migrate_photos_final.js` — konwersja base64 → JPG i upload do Storage (129/129 sukces ✅).
- `fix_json_urls.js` — aktualizacja URLi w bazie i JSON.

### Docker
- `docker-compose.yml` — tryb deweloperski z volume mounting dla live reload.
- Sieć: `supabase_default` (external) — łączy z Supabase.
- Port: `3005:3000` — dostęp przez http://localhost:3005

---

## Rekomendowane dodatkowe pliki / katalogi
- `.env.example` — przykładowe zmienne środowiskowe (bez sekretów).
- `docs/` lub `wiki/` — rozbicie roadmapy na odrębne strony (Faza 1..5).
- `.github/workflows/` — workflowy CI/CD (lint, test, build, deploy).
- `tests/` — testy jednostkowe/integracyjne (np. Vitest, Playwright).
- `contributing.md` — instrukcja dla współpracowników.

---

## Jak uruchomić projekt lokalnie (szybki start)

### Wymagania
- Docker i Docker Compose
- Działająca instancja Supabase (self-hosted lub cloud)
- Sieć Docker: `supabase_default`

### Uruchomienie

1. Sklonuj repo:
```bash
git clone <repo>
cd beertaste-v2
```

2. Skonfiguruj `.env` w głównym katalogu:
```bash
# .env
NEXT_PUBLIC_SUPABASE_URL=http://supabase-kong:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=<twój_klucz>
```

3. Uruchom kontener Docker:
```bash
docker compose up -d
```

4. Aplikacja dostępna na: **http://localhost:3005**

### Tryb deweloperski z live reload
Kontener jest skonfigurowany z volume mounting - zmiany w `client/` są automatycznie widoczne.

### Sprawdzanie logów
```bash
docker logs beertaste-v2-client --follow
```

---

## ✅ Checklist - Wykonane

- [x] Zainicjalizować TypeScript
- [x] Skonfigurować Supabase client (`client/lib/supabase.ts`)
- [x] Zmigrować 129 recenzji do PostgreSQL
- [x] Zmigrować 129 zdjęć z base64 do Supabase Storage (JPG)
- [x] Utworzyć bucket `beer-photos` (public access)
- [x] Zaktualizować `photo_url` w bazie danych
- [x] Stworzyć stronę główną z wyświetlaniem recenzji i zdjęć
- [x] Skonfigurować Docker Compose z volume mounting
- [x] Implementacja obliczania średniej oceny z obiektu `ratings`

## 📋 TODO - Do zrobienia

- [ ] Dodać `.env.example`
- [ ] Wygenerować typy TypeScript z Supabase
- [ ] Dodać paginację (obecnie limit 10 rekordów)
- [ ] Dodać wyszukiwarkę i filtry
- [ ] Stworzyć komponent `BeerCard`
- [ ] Dodać formularzy dodawania nowych recenzji
- [ ] Implementacja PWA (manifest, service worker)
- [ ] Dodać CI/CD workflow
- [ ] Dodać testy e2e

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