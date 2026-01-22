const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = 'http://192.168.50.234:8000';
const SERVICE_ROLE_KEY = 'TWOJ_KLUCZ_Z_ENV_SERWERA'; // <--- WKLEJ GO TUTAJ

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function migrate() {
  console.log('🚀 Start migracji (pnpm style)...');

  try {
    const rawData = fs.readFileSync('reviews.json');
    const oldReviews = JSON.parse(rawData);
    console.log(`📦 Znaleziono ${oldReviews.length} rekordów.`);

    const newBeers = oldReviews.map(old => ({
      id: old.id,
      beer_name: old.beerName || 'Nieznane',
      brewery: old.brewery?.trim() || 'Nieznany',
      style: old.style || 'Brak stylu',
      appearance_rating: old.foam || 3,
      aroma_rating: old.aromaQuality || 3,
      taste_rating: old.tasteBalance || 3,
      mouthfeel_rating: old.drinkability || 3,
      photo_url: old.photoUrl,
      tasting_date: old.tastingDate,
      user_id: old.userId
    }));

    // Małe paczki po 5 sztuk ze względu na ogromne zdjęcia Base64
    const batchSize = 5; 
    for (let i = 0; i < newBeers.length; i += batchSize) {
      const batch = newBeers.slice(i, i + batchSize);
      const { error } = await supabase.from('beers').upsert(batch);

      if (error) {
        console.error(`❌ Błąd w paczce ${i}:`, error.message);
      } else {
        console.log(`✅ Przeniesiono: ${i + batch.length}/${newBeers.length}`);
      }
    }

    console.log('🏁 Gotowe! Dane są już na Twoim serwerze.');
  } catch (err) {
    console.error('❌ Krytyczny błąd skryptu:', err.message);
  }
}

migrate();