# 📂 Podsumowanie Projektu: Beer Taste v2 (HomeLab + CI/CD)

**Data ostatniej aktualizacji:** 21.01.2026
**Status:** 🟢 ONLINE (CI/CD w pełni sprawne)

---

## 1. Status Projektu
Aplikacja **Next.js (v2)** została pomyślnie wdrożona na domowy serwer Linux.
Uruchomiono pełny pipeline **CI/CD**: każda zmiana wysłana przez `git push` (na gałąź main) automatycznie przebudowuje i aktualizuje aplikację na serwerze w ciągu ok. 1-2 minut.

---

## 2. Architektura i Infrastruktura

### 🖥️ Serwer
* **Adres:** `192.168.50.234`
* **OS:** Linux (Ubuntu/Debian)
* **Lokalizacja aplikacji:** `~/projects/beertaste-v2`
* **Port zewnętrzny:** `3005` (dostęp: http://192.168.50.234:3005)

### 🤖 GitHub Runner (Agent)
* **Typ:** Self-hosted runner działający w Dockerze.
* **Ścieżka instalacji:** `~/github-runners`
* **Uprawnienia:** Runner ma zamontowany wolumen hosta:
    * `host: /home/wojciech/projects` ➡️ `container: /home/wojciech/projects`
    * To pozwala mu zarządzać plikami w folderze projektów.

### 📦 Aplikacja (Kontener)
* **Technologia:** Next.js (Node.js v20-alpine).
* **Metoda uruchamiania:** Obraz Docker budowany z kodu + `docker compose`.
* **Zarządzanie:** Plik `docker-compose.yml` znajduje się fizycznie w `~/projects/beertaste-v2`.

---

## 3. Workflow (Jak działa automat?)

Plik sterujący: `.github/workflows/deploy.yml`

1.  **Czyszczenie:** Usuwa stare pliki tymczasowe z runnera.
2.  **Checkout:** Pobiera najnowszy kod z GitHuba.
3.  **Build:** Buduje obraz Docker `beertaste-v2:latest` z folderu `./client`.
4.  **Konfiguracja:** Kopiuje plik `docker-compose.prod.yml` z repozytorium do folderu docelowego na serwerze (`~/projects/beertaste-v2/docker-compose.yml`).
5.  **Deploy:** Wykonuje komendę w folderze projektu:
    ```bash
    docker compose up -d --force-recreate
    ```

---

## 4. Kluczowe Pliki Konfiguracyjne

| Plik | Lokalizacja w repo | Funkcja |
| :--- | :--- | :--- |
| `deploy.yml` | `.github/workflows/` | Skrypt automatyzacji (instrukcje dla Runnera). Używa ścieżek bezwzględnych. |
| `docker-compose.prod.yml` | `root` | Definicja produkcji. Mapuje porty `3005:3000`. To ten plik ląduje na serwerze. |
| `Dockerfile` | `client/` | Instrukcja budowania obrazu (zaktualizowano do **Node 20**). |

---

## 5. Aktualny Temat i Następne Kroki

Zatrzymaliśmy się na wyborze **Bazy Danych** i backendu.

**Decyzja do podjęcia:** Wybór technologii backendowej (Self-hosted).
1.  **Supabase (Self-Hosted):** Pełny stack (baza, auth, api, storage), ale duże wymagania zasobowe (wiele kontenerów).
2.  **PocketBase:** Lekka alternatywa (jeden plik/kontener), zawiera bazę SQLite, Auth i API. Idealne do HomeLab.
3.  **Czysty PostgreSQL:** Rozwiązanie klasyczne, wymaga ręcznego napisania Auth i API w Next.js.

**Plan na start kolejnej sesji:** Wdrożenie wybranej bazy danych (lokalnie na serwerze) i podpięcie jej do aplikacji Beer Taste.