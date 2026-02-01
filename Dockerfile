FROM node:20-alpine

# Instalujemy pnpm globalnie
RUN npm install -g pnpm

WORKDIR /app

# Kopiujemy pliki blokady i package.json z podfolderu client
COPY client/package.json client/pnpm-lock.yaml ./

# Instalujemy zależności używając pnpm
RUN pnpm install

# Kopiujemy resztę kodu z folderu client
COPY client/ .

# Budujemy aplikację Next.js
RUN pnpm run build

EXPOSE 3000

# Startujemy aplikację
CMD ["node", ".next/standalone/server.js"]