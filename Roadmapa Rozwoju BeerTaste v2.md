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

## 🏗️ Faza 1: Fundamenty i Bezpieczeństwo Typów (Type Safety) ✅ **UKOŃCZONA**

**Status:** Połączenie z bazą działa, aplikacja wyświetla dane.

### Co zostało zrobione:

**✅ Konfiguracja zmiennych środowiskowych:**
- Utworzono plik `.env` z konfiguracją Supabase
- URL: `http://supabase-kong:8000` (dla Docker network)
- Anon Key skonfigurowany

**✅ Klient Supabase:**
- Zaimplementowano `client/lib/supabase.ts` z createClient
- Obsługa placeholder dla build time

**✅ Migracja danych:**
- 129 recenzji zaimportowanych do tabeli `reviews`
- 129 zdjęć skonwertowanych z base64 do JPG (~171KB każde)
- Upload do Supabase Storage bucket `beer-photos`
- Wszystkie rekordy mają `photo_url` wskazujący na Storage

**✅ Strona główna:**
- Server Component pobierający 10 najnowszych recenzji
- Wyświetlanie zdjęć obok recenzji (24x24px, rounded)
- Obliczanie średniej oceny z JSONB `ratings` (aroma, taste, mouthfeel, appearance)
- Formatowanie daty w formacie polskim

### ⚠️ Do dopracowania:
- [ ] Wygenerować typy TypeScript z Supabase CLI
- [ ] Zastąpić `any` typami z `Database` interface

---

## 🐻 Faza 2: Zarządzanie Stanem i UI (Zustand & Shadcn)

**Cel:** Przygotowanie profesjonalnej architektury pod interakcje użytkownika.

- **Setup Shadcn/UI:** Inicjalizacja komponentów: `Button`, `Card`, `Input`, `Badge`, `Skeleton`.
- **Globalny Store (Zustand):** Stwórz `src/store/useBeerStore.ts` z polem `searchQuery`, `filters` (styl piwa, ocena), `viewMode` (grid/list).
- **Layout aplikacji:** Przygotuj responsywny kontener z Tailwind CSS, przystosowany do PWA.

---

## 🍺 Faza 3: Wyświetlanie i Optymalizacja Danych — **W TRAKCIE** 🔄

**Status:** Podstawowe wyświetlanie działa, trwa optymalizacja.

### ✅ Zrealizowane:
- **Server Components Fetching:** Dane pobierane bezpośrednio w `page.tsx`
- **Wyświetlanie zdjęć:** Zdjęcia z Supabase Storage (obecnie `<img>`, 24x24px)
- **Parsowanie `jsonb` `ratings`:** Obliczanie średniej z 4 kryteriów z zaokrągleniem
- **Limit:** Wyświetlanie 10 najnowszych recenzji

### 📋 TODO:
- [ ] Zamienić `<img>` na `next/image` (lazy loading, optymalizacja)
- [ ] Zwiększyć rozmiar zdjęć (obecnie 24x24px, zbyt małe)
- [ ] Stworzyć dedykowany komponent `BeerCard`
- [ ] Dodać paginację lub infinite scroll (pokazać wszystkie 129)
- [ ] Wyszukiwarka real-time (po nazwie piwa/browaru)
- [ ] Filtry (styl, zakres ocen)
- [ ] Sortowanie (data, ocena, nazwa)

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
