#!/bin/bash
# Potwierdzanie użytkownika w Supabase Auth przez SQL

EMAIL="${1:-derastro@gmail.com}"

echo "Potwierdzam email: $EMAIL"

PGPASSWORD=postgres psql -h localhost -p 5432 -U postgres -d postgres -c "
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmed_at = NOW() 
WHERE email = '$EMAIL';
"

echo "Gotowe! Możesz się teraz zalogować."
