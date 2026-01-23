---
title: Roadmapa Rozwoju: BeerTaste v2
description: Dokumentacja techniczna i plan wdrożenia projektu BeerTaste v2 (HomeLab, Supabase, Next.js).
published: true
dateCreated: 2026-01-23T00:00:00.000Z
date: 2026-01-23T00:00:00.000Z
tags: roadmap, beertaste, nextjs, supabase	editor: markdown
---

# 🗺️ Roadmapa Rozwoju: BeerTaste v2 (Expert JS/TS Path)

To jest dokumentacja techniczna i plan wdrożenia "krok po kroku" dla projektu **BeerTaste v2**. Projekt oparty jest na infrastrukturze HomeLab (Docker, self-hosted Supabase) oraz nowoczesnym stacku **Next.js 15**.

---

## 🏗️ Faza 1: Fundamenty i Bezpieczeństwo Typów (Type Safety)

**Cel:** Połączenie aplikacji z bazą i wyeliminowanie błędów `any` w TypeScript.

**Konfiguracja zmiennych środowiskowych:**

Utwórz plik `.env.local` i zdefiniuj:

```text
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://192.168.50.234
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
```

**Generowanie typów (The Expert Way):**

```bash
npx supabase gen types typescript --local > src/types/supabase.ts
```

Celem jest pełne autouzupełnianie pól tabeli `reviews` w VS Code.

**Inicjalizacja klienta Supabase:**

Zaimplementuj `src/lib/supabase.ts` korzystając z wygenerowanego interfejsu `Database`.

---

## 🐻 Faza 2: Zarządzanie Stanem i UI (Zustand & Shadcn)

**Cel:** Przygotowanie profesjonalnej architektury pod interakcje użytkownika.

- **Setup Shadcn/UI:** Inicjalizacja komponentów: `Button`, `Card`, `Input`, `Badge`, `Skeleton`.
- **Globalny Store (Zustand):** Stwórz `src/store/useBeerStore.ts` z polem `searchQuery`, `filters` (styl piwa, ocena), `viewMode` (grid/list).
- **Layout aplikacji:** Przygotuj responsywny kontener z Tailwind CSS, przystosowany do PWA.

---

## 🍺 Faza 3: Wyświetlanie i Optymalizacja Danych

**Cel:** Ożywienie 129 zmigrowanych recenzji.

- **Server Components Fetching:** Pobieraj dane bezpośrednio w `page.tsx` (optymalizacja pod szybkość).
- **Komponent `BeerCard`:** Korzystaj z `next/image` do serwowania zdjęć z Supabase Storage (lazy loading, optymalizacja wagi).
- **Parsowanie `jsonb` `ratings`:** Przekształć dane do czytelnych statystyk.
- **Wyszukiwarka "Real-time":** Połącz input z Zustandem i filtruj listę po stronie klienta.

---

## 📱 Faza 4: Mobilność i PWA

**Cel:** Zamiana strony WWW w aplikację na telefonie.

- **Setup `@ducanh2912/next-pwa`:** Dodaj konfigurację do `next.config.ts`.
- **Manifest i ikony:** Wygeneruj `manifest.json` oraz zestaw ikon pod iOS/Android.
- **Service Worker:** Dodaj podstawowe cache'owanie, aby aplikacja otwierała się szybko offline.

---

## 🚀 Faza 5: Funkcje Zaawansowane (Expert Level)

**Cel:** Rozbudowa aplikacji o nowe możliwości.

- **Dodawanie recenzji:** Formularz z uploadem zdjęć bezpośrednio do Supabase Storage.
- **Statystyki:** Dashboard z wykresami (np. najpopularniejsze style, średnie oceny).
- **Auth (opcjonalnie):** Zabezpieczenie panelu dodawania przez Supabase Auth.

---

> 📝 Instrukcja dla AI (do wkleić w nowym czacie):
>
> "Jesteśmy w trakcie projektu BeerTaste v2. Infrastruktura i migracja danych (129 rekordów) są gotowe. Mamy działający CI/CD. Realizujemy Fazę 1: Krok 1 i 2 (Konfiguracja i Typowanie). Korzystaj z pliku `beertaste_v2_roadmap.md` jako źródła prawdy. Nic na szybko, czekaj na moje potwierdzenia."

---

**Uwagi:**

- Plik gotowy do użycia w Wiki.js (frontmatter + Markdown).
- Jeśli chcesz, mogę dodać sekcję „Zadania” z checklistą i linkami do issue/PR.  
