---
title: Workflow Projektu: BeerTaste v2
description: Opis procesu workflow od lokalnego programowania po produkcję na serwerze.
published: true
dateCreated: 2026-01-23T00:00:00.000Z
date: 2026-01-23T00:00:00.000Z
tags: beertaste, workflow, development
editor: markdown
---

# 🚀 Workflow Projektu: BeerTaste v2
Poniżej znajduje się opis procesu, który wypracowaliśmy: od lokalnego programowania po produkcję na serwerze.

## 1. Architektura Systemu
System składa się z trzech głównych warstw:

*   **Lokalne środowisko (PC):** VS Code, Node.js (do skryptów migracji), Git.
*   **Kontrola wersji (GitHub):** Centralne repozytorium kodu.
*   **Serwer Produkcyjny (Home Server):** Docker, Supabase (Baza danych + Storage), Coolify (zarządzanie wdrożeniem Next.js).

## 2. Przepływ Informacji (Code Flow)
### KROK 1: Praca lokalna
1.  Piszesz kod w VS Code na swoim komputerze.
2.  Testujesz zmiany lokalnie (`npm run dev`).
3.  Zapisujesz postępy lokalnie w systemie Git.

### KROK 2: Commit i Push
Gdy zmiana jest gotowa, wysyłasz ją do "chmury":

```bash
git add .
git commit -m "Opis zmian (np. dodanie galerii piw)"
git push origin main
```

*   **Git Commit:** Tworzy "zdjęcie" Twojego kodu w danym momencie.
*   **Git Push:** Wysyła to zdjęcie do Twojego repozytorium na GitHub.

### KROK 3: Automatyczny Deployment (Coolify)
1.  Twój serwer (Coolify) jest podłączony do GitHuba przez Webhooks.
2.  W momencie wykrycia push, Coolify automatycznie:
    *   Pobiera najnowszą wersję kodu.
    *   Buduje obraz (Build).
    *   Restartuje kontener z aplikacją Next.js.
3.  Zmiany stają się widoczne pod adresem Twojego serwera.

## 3. Przepływ Danych (Data Flow)
To kluczowy element, który dopracowaliśmy podczas migracji Twoich 129 recenzji:

*   **Baza Danych (PostgreSQL):** Przechowuje teksty, nazwy piw i oceny w formacie jsonb. Dane trafiają tu poprzez import CSV w panelu Supabase.
*   **Storage (S3):** Przechowuje fizyczne pliki .jpg. Trafiają tu poprzez ręczne wgranie plików do bucketa `beer-photos`.
*   **Połączenie:** Tabela w bazie zawiera kolumnę `photo_url`, która wskazuje na adres IP serwera (np. 192.168.50.234:8000), co pozwala aplikacji Next.js "zassać" zdjęcie prosto ze Storage.

## 4. Złote Zasady (Best Practices)
*   **Nie trzymaj plików w Gicie:** Zdjęcia zawsze trafiają do Storage, a nie do repozytorium kodu. Dzięki temu GitHub pozostaje "lekki".
*   **Zmienne środowiskowe (.env):** Klucze API i adresy IP serwera trzymaj w plikach `.env`, których nie wysyłasz do GitHuba (dla bezpieczeństwa).
*   **Small Commits:** Rób częste, małe commity. Łatwiej naprawić błąd w jednej małej zmianie niż w tysiącu linii kodu naraz.
