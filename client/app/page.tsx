export const dynamic = 'force-dynamic'; // To blokuje próby połączenia z bazą podczas budowy

import { supabase } from '../lib/supabase';
import AuthGuard from '@/components/AuthGuard';
import LogoutButton from '@/components/LogoutButton';

// Definiujemy kształt danych, aby TS nie zgadywał
interface BeerReview {
  id: string | number;
  beer_name: string;
  brewery: string;
  ratings?: {
    aroma?: number;
    taste?: number;
    mouthfeel?: number;
    appearance?: number;
  };
  created_at: string;
  note?: string;
  photo_url?: string;
  tasting_date?: string;
}

export default async function Home() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <main className="p-10 bg-gray-400 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-black mb-4 text-white">🍻 BeerTaste v2</h1>
          <p className="text-white">
            Brak konfiguracji Supabase. Ustaw
            {' '}NEXT_PUBLIC_SUPABASE_URL i
            {' '}NEXT_PUBLIC_SUPABASE_ANON_KEY.
          </p>
        </div>
      </main>
    );
  }

  // Wykonujemy zapytanie
  let data = null as any;
  let error: { message: string } | null = null;

  try {
    const response = await supabase
      .from('reviews')
      .select('*')
      .limit(10)
      .order('created_at', { ascending: false });

    data = response.data;
    error = response.error ? { message: response.error.message } : null;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Nieznany błąd';
    error = { message };
  }

  // Rzutujemy dane na nasz interfejs (to uciszy błąd 'never')
  const reviews = data as BeerReview[] | null;

  if (error) {
    return (
      <main className="p-10 bg-gray-400 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-black mb-4 text-white">🍻 BeerTaste v2</h1>
          <p className="text-red-200">Błąd: {error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <AuthGuard>
      <main className="p-10 bg-gray-400 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-5xl font-black text-white">🍻 BeerTaste v2</h1>
            <LogoutButton />
          </div>
          <p className="text-white mb-10 italic">Twoje archiwum 129 recenzji ożyło!</p>
        
        <div className="space-y-4">
          {reviews?.map((review) => {
            const avgRating = review.ratings 
              ? Math.round(
                  (Object.values(review.ratings).reduce((a, b) => (a || 0) + (b || 0), 0) / 
                  Object.values(review.ratings).filter(v => v != null).length) * 10
                ) / 10
              : 0;
            
            return (
              <div key={review.id} className="p-6 bg-white rounded-2xl shadow-sm border border-stone-200">
                <div className="flex gap-4">
                  {review.photo_url && (
                    <img 
                      src={review.photo_url} 
                      alt={review.beer_name}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-stone-800">{review.beer_name}</h2>
                    <p className="text-stone-500">{review.brewery}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-bold">
                        ⭐ {avgRating}/5
                      </span>
                      <span className="text-xs text-stone-400">
                        {new Date(review.tasting_date || review.created_at).toLocaleDateString('pl-PL')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
    </AuthGuard>
  )
}