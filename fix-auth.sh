#!/bin/bash
set -e

cd /home/wojciech/projects/supabase/docker

# Sprawdź czy .env istnieje
if [ ! -f .env ]; then
  echo "Kopiuję .env.example -> .env"
  cp .env.example .env
fi

# Dodaj autoconfirm jeśli nie istnieje
if ! grep -q "ENABLE_EMAIL_AUTOCONFIRM" .env; then
  echo "" >> .env
  echo "# Auto-confirm email for development" >> .env
  echo "ENABLE_EMAIL_AUTOCONFIRM=true" >> .env
  echo "✓ Dodano ENABLE_EMAIL_AUTOCONFIRM=true"
else
  # Upewnij się że jest ustawione na true
  sed -i 's/ENABLE_EMAIL_AUTOCONFIRM=.*/ENABLE_EMAIL_AUTOCONFIRM=true/' .env
  echo "✓ Zaktualizowano ENABLE_EMAIL_AUTOCONFIRM=true"
fi

# Restart auth container
echo "Restartuję supabase-auth..."
docker restart supabase-auth

echo ""
echo "✅ Gotowe! Teraz możesz:"
echo "   1. Odświeżyć stronę http://localhost:3000/auth"
echo "   2. Zarejestrować nowe konto (będzie od razu potwierdzone)"
echo "   3. Zalogować się bez czekania na email"
