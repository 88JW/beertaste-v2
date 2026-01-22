📂 Podsumowanie Projektu: Beer Taste v2 (HomeLab + CI/CD)

Ostatnia aktualizacja: 22.01.2026
Status: 🟢 ONLINE (Infrastruktura gotowa, faza Development)

1. Status Projektu i Infrastruktura

Aplikacja Next.js (v15) została pomyślnie wdrożona na domowy serwer Linux. Uruchomiono pełny pipeline CI/CD.

🖥️ Serwer i Sieć

Adres IP: 192.168.50.234

System operacyjny: Linux (Ubuntu/Debian)

Lokalizacja aplikacji: ~/projects/beertaste-v2

Port zewnętrzny: 3005 (Dostęp: http://192.168.50.234:3005)

Baza danych: Supabase Self-Hosted (Docker) działający na tym samym IP.

🤖 GitHub Runner (CI/CD)

Typ: Self-hosted runner (Docker).

Workflow: .github/workflows/deploy.yml automatycznie przebudowuje obraz Docker beertaste-v2:latest i restartuje kontener po każdym git push na gałąź main.

2. Stack Technologiczny (Expert JS/TS Path)

Core

Framework: Next.js 15 (App Router, katalog src/).

Język: TypeScript (Strict mode).

Manager paczek: pnpm.

Backend & Data

Baza danych: PostgreSQL (część Supabase Self-Hosted).

Komunikacja z DB: @supabase/supabase-js (Supabase Client).

Zarządzanie stanem: Zustand (Zarządzanie filtrowaniem, wyszukiwaniem i UI).

Przechowywanie plików: Supabase Storage (Bucket: beer-photos).

UI & UX

Stylizacja: Tailwind CSS.

Komponenty: shadcn/ui (nowoczesny design system).

Mobilność: PWA (Progressive Web App - @ducanh2912/next-pwa).

3. Status Danych (Migration Complete)

Dane zostały pomyślnie zmigrowane z formatu JSON do relacyjnej bazy SQL.

Tabela: public.reviews

Liczba rekordów: 129 wierszy.

Kolumny kluczowe:

ratings (JSONB) - kompleksowe oceny smaku, aromatu itp.

photo_url - linki do fizycznych plików JPG w Storage.

tasting_date (timestamptz) - daty degustacji.

Pliki: 129 zdjęć wgranych do Bucketu beer-photos.

4. Planowana Architektura Kodu (src/)

src/app/ - Strony (Server Components) i routing.

src/components/ - Komponenty UI (shadcn) i biznesowe.

src/lib/ - Inicjalizacja klienta Supabase i narzędzia pomocnicze.

src/store/ - Sklepy Zustand (np. useBeerStore.ts).

src/types/ - Definicje typów TS generowane z bazy Supabase.

5. Następne Kroki (Roadmap)

Konfiguracja PWA: Dodanie manifestu, ikon i Service Workera (Kluczowe dla mobilności).

Type Safety: Wygenerowanie typów TS z bazy Supabase (npx supabase gen types).

Zustand Setup: Stworzenie store'a do obsługi globalnej wyszukiwarki piw.

UI Development: Budowa głównego Dashboardu z galerią kart (shadcn + Next Image).

Filtrowanie: Implementacja dynamicznego filtrowania piw po ocenach i stylach.

6. Wytyczne dla Mentora AI

Pracujemy w trybie Expert Full-Stack (JS/TS).

Kod musi być czysty, typowany i gotowy do działania w środowisku Dockerowym.

Nic na szybko - czekaj na potwierdzenie każdego etapu.