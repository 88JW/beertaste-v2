# BeerTaste v2 - Client (Next.js 15)

Nowoczesny frontend dla aplikacji do katalogowania i recenzowania piw. Zbudowany w Next.js 15 z TypeScript i Tailwind CSS.

## 🚀 Uruchomienie

### Docker (Zalecane)
```bash
# Z głównego katalogu projektu
docker compose up -d
# Aplikacja dostępna na http://localhost:3005
```

### Lokalnie (Development)
```bash
cd client
pnpm install
pnpm dev
# Otwórz http://localhost:3000
```

## 📦 Stack Technologiczny

- **Framework:** Next.js 15 (App Router)
- **Język:** TypeScript
- **Stylowanie:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Storage)
- **Konteneryzacja:** Docker

## 🏗️ Struktura

```
client/
├── app/              # App Router (Next.js 15)
│   ├── page.tsx     # Strona główna - lista recenzji
│   ├── layout.tsx   # Globalny layout
│   └── globals.css  # Style Tailwind
├── lib/
│   └── supabase.ts  # Konfiguracja klienta Supabase
├── types/           # TypeScript types
└── public/          # Statyczne pliki
```

## ✨ Funkcjonalności

- ✅ Wyświetlanie 10 najnowszych recenzji piw
- ✅ Zdjęcia piw z Supabase Storage (129 zdjęć JPG)
- ✅ Obliczanie średniej oceny z 4 kryteriów (aroma, taste, mouthfeel, appearance)
- ✅ Responsywny design z Tailwind CSS
- ✅ Server-Side Rendering (SSR)

## 🔧 Konfiguracja

Utwórz plik `.env` w głównym katalogu projektu:

```bash
# Dla Docker (wewnętrzna sieć)
NEXT_PUBLIC_SUPABASE_URL=http://supabase-kong:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Lub dla lokalnego developmentu:

```bash
# Dla localhost
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 📊 Dane

Aplikacja korzysta z:
- **Tabela:** `reviews` (129 rekordów)
- **Storage bucket:** `beer-photos` (129 zdjęć JPG, ~171KB każde)
- **Format ratings:** JSONB z polami: aroma, taste, mouthfeel, appearance

## 🔜 Roadmapa

- [ ] Wygenerować typy TypeScript z Supabase
- [ ] Zamienić `<img>` na `next/image`
- [ ] Dodać paginację (pokazać wszystkie 129 recenzji)
- [ ] Stworzyć komponent `BeerCard`
- [ ] Dodać wyszukiwarkę i filtry
- [ ] Formularz dodawania nowych recenzji
- [ ] PWA setup (manifest, service worker)

## 📝 Więcej informacji

Zobacz główną dokumentację projektu:
- [PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md)
- [Roadmapa Rozwoju BeerTaste v2.md](../Roadmapa%20Rozwoju%20BeerTaste%20v2.md)

