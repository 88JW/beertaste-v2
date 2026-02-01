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

    const reviewsPath = path.join(__dirname, 'src', 'reviews.json');
    const reviewsData = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));
    console.log(`📊 Znaleziono ${reviewsData.length} recenzji w JSON\n`);

    const { data: existingReviews, error: fetchError } = await supabase
      .from('reviews')
      .select('id, beer_name, brewery, tasting_date, photo_url');

    if (fetchError) throw new Error(`Błąd: ${fetchError.message}`);
    console.log(`📝 Znaleziono ${existingReviews.length} wpisów w bazie\n`);

    let uploaded = 0, skipped = 0, errors = 0;
    const updatedReviews = [];

    for (let i = 0; i < reviewsData.length; i++) {
      const review = reviewsData[i];
      
      const matchingReview = existingReviews.find(r => {
        const dbDate = r.tasting_date.split('T')[0];
        return normalize(r.beer_name) === normalize(review.beerName) &&
               normalize(r.brewery) === normalize(review.brewery) &&
               dbDate === review.tastingDate;
      });

      if (!matchingReview) {
        console.log(`⚠️  ${i+1}/${reviewsData.length} Pominięto: ${review.beerName} (${review.brewery})`);
        updatedReviews.push(review);
        skipped++;
        continue;
      }

      if (!review.photoUrl || !review.photoUrl.startsWith('data:image')) {
        console.log(`⏭️  ${i+1}/${reviewsData.length} Brak zdjęcia: ${review.beerName}`);
        updatedReviews.push(review);
        skipped++;
        continue;
      }

      try {
        const imageBuffer = base64ToBuffer(review.photoUrl);
        const fileName = `${matchingReview.id}.jpg`;
        
        const { error: uploadError } = await supabase.storage
          .from('beer-photos')
          .upload(fileName, imageBuffer, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('beer-photos')
          .getPublicUrl(fileName);

        const { error: updateError } = await supabase
          .from('reviews')
          .update({ photo_url: publicUrl })
          .eq('id', matchingReview.id);

        if (updateError) throw updateError;

        updatedReviews.push({ ...review, photoUrl: publicUrl });
        uploaded++;
        console.log(`✅ ${i+1}/${reviewsData.length} ${review.beerName}`);

      } catch (err) {
        console.error(`❌ ${i+1}/${reviewsData.length} ${review.beerName}: ${err.message}`);
        updatedReviews.push(review);
        errors++;
      }
    }

    // Zapisz zaktualizowany JSON
    fs.writeFileSync(reviewsPath, JSON.stringify(updatedReviews, null, 2));
    console.log(`\n💾 Zaktualizowano plik JSON\n`);

    console.log('📊 PODSUMOWANIE:');
    console.log(`✅ Zuploadowane: ${uploaded}`);
    console.log(`⏭️  Pominięte: ${skipped}`);
    console.log(`❌ Błędy: ${errors}\n`);

  } catch (error) {
    console.error('❌ Błąd krytyczny:', error);
    process.exit(1);
  }
}

migratePhotos();
