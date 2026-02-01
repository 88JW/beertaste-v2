const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const normalize = (str) => str?.trim().replace(/\s+/g, ' ').toLowerCase() || '';

function base64ToBuffer(base64String) {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  return Buffer.from(base64Data, 'base64');
}

async function migratePhotos() {
  try {
    console.log('🚀 Rozpoczynam migrację zdjęć...\n');

    // Wczytaj plik reviews.json
    const reviewsPath = path.join(__dirname, 'src', 'reviews.json');
    const reviewsData = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));

    console.log(`📊 Znaleziono ${reviewsData.length} recenzji\n`);

    // Pobierz istniejące wpisy z bazy
    const { data: existingReviews, error: fetchError } = await supabase
      .from('reviews')
      .select('id, beer_name, brewery, tasting_date, photo_url');

    if (fetchError) {
      throw new Error(`Błąd pobierania wpisów: ${fetchError.message}`);
    }

    console.log(`📝 Znaleziono ${existingReviews.length} wpisów w bazie\n`);

    let uploaded = 0;
    let skipped = 0;
    let errors = 0;

    // Funkcja do normalizacji nazw (usuwa wszystkie białe znaki na początku/końcu, zamienia wielokrotne spacje na pojedyncze)
    const normalize = (str) => {
      if (!str) return '';
      return str.trim().replace(/\s+/g, ' ').toLowerCase();
    };

    for (let i = 0; i < reviewsData.length; i++) {
      const review = reviewsData[i];
      
      if (i === 0) {
        console.log('\n📋 Pierwszy wpis JSON:', JSON.stringify(review, null, 2).substring(0, 300));
        console.log('\n📋 Pierwszy wpis DB:', JSON.stringify(existingReviews[0], null, 2));
      }
      
      // Znajdź odpowiadający wpis w bazie po nazwie piwa, browarze i dacie
      const matchingReview = existingReviews.find(r => {
        const beerMatch = normalize(r.beer_name) === normalize(review.beerName);
        const breweryMatch = normalize(r.brewery) === normalize(review.brewery);
        // Porównaj tylko datę (bez czasu)
        const dbDate = r.tasting_date ? r.tasting_date.split('T')[0] : null;
        const dateMatch = dbDate === review.tastingDate;
        
        return beerMatch && breweryMatch && dateMatch;
      });

      if (!matchingReview) {
        console.log(`⚠️  Nie znaleziono wpisu dla: ${review.beerName} (${review.brewery})`);
        skipped++;
        continue;
      }

      // Sprawdź czy ma zdjęcie base64
      if (!review.photoUrl || !review.photoUrl.startsWith('data:image/')) {
        console.log(`⏭️  Brak zdjęcia base64 dla: ${review.beerName}`);
        skipped++;
        continue;
      }

      try {
        // Konwertuj base64 na buffer
        const imageBuffer = base64ToBuffer(review.photoUrl);
        
        // Generuj nazwę pliku (używamy ID z bazy)
        const fileName = `${matchingReview.id}.jpg`;
        
        // Upload do Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('beer-photos')
          .upload(fileName, imageBuffer, {
            contentType: 'image/jpeg',
            upsert: true // Nadpisz jeśli już istnieje
          });

        if (uploadError) {
          throw uploadError;
        }

        // Pobierz publiczny URL
        const { data: urlData } = supabase.storage
          .from('beer-photos')
          .getPublicUrl(fileName);

        // Zaktualizuj wpis w bazie z nowym URL
        const { error: updateError } = await supabase
          .from('reviews')
          .update({ photo_url: urlData.publicUrl })
          .eq('id', matchingReview.id);

        if (updateError) {
          throw updateError;
        }

        console.log(`✅ ${i + 1}/${reviewsData.length} - ${review.beerName} (${review.brewery})`);
        uploaded++;

      } catch (err) {
        console.error(`❌ Błąd dla ${review.beerName}: ${err.message}`);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 PODSUMOWANIE:');
    console.log(`✅ Zuploadowane: ${uploaded}`);
    console.log(`⏭️  Pominięte: ${skipped}`);
    console.log(`❌ Błędy: ${errors}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('💥 Krytyczny błąd:', error);
    process.exit(1);
  }
}

// Uruchom migrację
migratePhotos();
