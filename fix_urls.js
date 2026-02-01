const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixUrls() {
  const { data } = await supabase.from('reviews').select('id, photo_url');
  
  let updated = 0;
  for (const review of data) {
    if (review.photo_url && review.photo_url.includes('supabase-kong:8000')) {
      const newUrl = review.photo_url.replace('supabase-kong:8000', 'localhost:8000');
      await supabase.from('reviews').update({ photo_url: newUrl }).eq('id', review.id);
      updated++;
      console.log(`${updated}/${data.length}: ${review.id}`);
    }
  }
  
  console.log(`\n✅ Zaktualizowano ${updated} URLi`);
}

fixUrls();
