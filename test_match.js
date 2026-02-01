const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const normalize = (str) => str?.trim().replace(/\s+/g, ' ').toLowerCase() || '';

async function test() {
  // Pobierz dane
  const jsonData = JSON.parse(fs.readFileSync('src/reviews.json', 'utf8'));
  const { data: dbData } = await supabase
    .from('reviews')
    .select('id, beer_name, brewery, tasting_date')
    .limit(5);

  console.log('\n📋 Pierwsze 3 wpisy JSON:');
  jsonData.slice(0, 3).forEach((r, i) => {
    console.log(`${i+1}. "${r.beerName}" / "${r.brewery}" / ${r.tastingDate}`);
  });

  console.log('\n📋 Pierwsze 3 wpisy DB:');
  dbData.slice(0, 3).forEach((r, i) => {
    const date = r.tasting_date.split('T')[0];
    console.log(`${i+1}. "${r.beer_name}" / "${r.brewery}" / ${date}`);
  });

  console.log('\n🔍 Test matchingu dla pierwszego wpisu JSON:');
  const firstJson = jsonData[0];
  console.log(`Szukam: "${normalize(firstJson.beerName)}" / "${normalize(firstJson.brewery)}" / ${firstJson.tastingDate}`);
  
  const match = dbData.find(r => {
    const dbDate = r.tasting_date.split('T')[0];
    const beerMatch = normalize(r.beer_name) === normalize(firstJson.beerName);
    const breweryMatch = normalize(r.brewery) === normalize(firstJson.brewery);
    const dateMatch = dbDate === firstJson.tastingDate;
    
    console.log(`  Porównanie z: "${normalize(r.beer_name)}" / "${normalize(r.brewery)}" / ${dbDate}`);
    console.log(`    Beer: ${beerMatch}, Brewery: ${breweryMatch}, Date: ${dateMatch}`);
    
    return beerMatch && breweryMatch && dateMatch;
  });

  console.log(match ? '\n✅ Znaleziono match!' : '\n❌ Brak matcha');
  if (match) console.log('Match ID:', match.id);
}

test().catch(console.error);
