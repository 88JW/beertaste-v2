const fs = require('fs');
const path = require('path');

const reviewsPath = path.join(__dirname, 'src', 'reviews.json');
const reviewsData = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));

const updated = reviewsData.map(review => {
  if (review.photoUrl && review.photoUrl.includes('supabase-kong:8000')) {
    return {
      ...review,
      photoUrl: review.photoUrl.replace('supabase-kong:8000', 'localhost:8000')
    };
  }
  return review;
});

fs.writeFileSync(reviewsPath, JSON.stringify(updated, null, 2));
console.log('✅ Zaktualizowano URLe w JSON');
