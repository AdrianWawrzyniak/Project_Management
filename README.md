================================================================================
INSTRUKCJA URUCHOMIENIA PROJEKTU - ProjectManageApp
================================================================================

Projekt składa się z dwóch części:
- CLIENT: Aplikacja Next.js (frontend)
- SERVER: API Express.js (backend)

================================================================================
WYMAGANIA SYSTEMOWE
================================================================================

1. Node.js (wersja 18 lub nowsza)
   Pobierz z: https://nodejs.org/

2. PostgreSQL (wersja 12 lub nowsza)
   Pobierz z: https://www.postgresql.org/download/
   
3. npm (instalowany razem z Node.js)


================================================================================
KONFIGURACJA BAZY DANYCH
================================================================================

1. Zainstaluj PostgreSQL i uruchom serwer bazy danych

2. Utwórz nową bazę danych:
   
   W PostgreSQL (psql lub pgAdmin):
   CREATE DATABASE projectmanageapp;

3. Zapisz dane dostępowe do bazy danych:
   - Host: localhost (domyślnie)
   - Port: 5432 (domyślnie)
   - Database: projectmanageapp
   - User: postgres (lub inna nazwa użytkownika)
   - Password: (twoje hasło)

================================================================================
KONFIGURACJA ZMIENNYCH ŚRODOWISKOWYCH
================================================================================

1. SERVER - Utwórz plik .env w katalogu server/

   Przykładowa zawartość pliku server/.env:
   
   DATABASE_URL="postgresql://postgres:twoje_haslo@localhost:5432/projectmanageapp?schema=public"
   PORT=3000
   
   UWAGA: Zamień "twoje_haslo" na rzeczywiste hasło do PostgreSQL
   Format DATABASE_URL: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public

2. CLIENT - Utwórz plik .env.local w katalogu client/

   Przykładowa zawartość pliku client/.env.local:
   
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
   
   UWAGA: Port musi odpowiadać portowi serwera (domyślnie 3000)

================================================================================
INSTALACJA ZALEŻNOŚCI
================================================================================

1. Otwórz terminal w głównym katalogu projektu

2. Zainstaluj zależności dla SERVER:
   
   cd server
   npm install

3. Zainstaluj zależności dla CLIENT:
   
   cd ../client
   npm install

================================================================================
KONFIGURACJA PRISMA I BAZY DANYCH
================================================================================

1. Przejdź do katalogu server/

2. Wygeneruj Prisma Client:
   
   npx prisma generate

3. Uruchom migracje bazy danych (utworzy tabele):
   
   npx prisma migrate deploy
   
   LUB jeśli chcesz utworzyć nową migrację:
   npx prisma migrate dev

4. Wypełnij bazę danych danymi testowymi (seed):
   
   npm run seed
   
   LUB bezpośrednio:
   npx prisma db seed

================================================================================
URUCHOMIENIE APLIKACJI
================================================================================


1. Uruchom SERVER (w osobnym terminalu):
   
   cd server
   npm run dev
   
   Serwer powinien uruchomić się na porcie 3000 (lub innym zdefiniowanym w .env)
   Sprawdź w konsoli: "Server running on port 3000"

2. Uruchom CLIENT (w osobnym terminalu):
   
   cd client
   npm run dev
   
   Aplikacja powinna uruchomić się na porcie 3001 (Next.js domyślnie używa 3000, 
   ale ponieważ serwer już zajmuje 3000, Next.js automatycznie użyje 3001)
   
   Otwórz przeglądarkę: http://localhost:3001


================================================================================
STRUKTURA PROJEKTU
================================================================================

ProjectManageApp/
├── client/                # Frontend (Next.js)
│   ├── app/               # Strony i komponenty aplikacji
│   ├── state/             # Redux store i API (RTK Query)
│   ├── lib/               # Narzędzia pomocnicze
│   ├── public/            # Pliki statyczne (obrazy, etc.)
│   └── package.json       # Zależności frontendu
│
├── server/                 # Backend (Express.js)
│   ├── src/
│   │   ├── controllers/   # Kontrolery API 
│   │   ├── routes/        # Definicje route API
│   │   └── index.ts       # Główny plik serwera
│   ├── prisma/
│   │   ├── schema.prisma  # Schemat bazy danych
│   │   ├── migrations/    # Migracje bazy danych
│   │   └── seedData/      # Dane testowe (JSON)
│   └── package.json       # Zależności backendu
│
└── INSTRUKCJA.txt         # Ten plik


================================================================================
DODATKOWE INFORMACJE
================================================================================

Technologie użyte w projekcie:

FRONTEND:
- Next.js 16.1.1 (React framework)
- TypeScript
- Tailwind CSS (stylowanie)
- Redux Toolkit (zarządzanie stanem)
- RTK Query (zarządzanie zapytaniami API)
- Material-UI DataGrid (tabele)
- Recharts (wykresy)
- React DnD (drag and drop)
- Lucide React (ikony)

BACKEND:
- Express.js (framework Node.js)
- TypeScript
- Prisma ORM (zarządzanie bazą danych)
- PostgreSQL (baza danych)
- Helmet (zabezpieczenia)
- CORS (Cross-Origin Resource Sharing)
- Morgan (logowanie requestów)
