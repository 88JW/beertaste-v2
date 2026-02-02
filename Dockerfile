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

# Kopiujemy public do standalone (fix dla PWA + standalone)
RUN cp -r public .next/standalone/public

EXPOSE 3000

# Startujemy aplikację (bez standalone, normalny start)
CMD ["pnpm", "start"]