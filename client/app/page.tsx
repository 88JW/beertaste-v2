export const dynamic = 'force-dynamic';

import { supabase } from '../lib/supabase';
import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';

interface BeerReview {
  id: string | number;
  beer_name: string;
  brewery: string;
  beer_style?: string;
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
      <main className="p-6 bg-gray-50 min-h-screen">
        <p className="text-gray-600">Brak konfiguracji Supabase.</p>
      </main>
    );
  }

  let data = null as any;
  let error: { message: string} | null = null;

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

  const reviews = data as BeerReview[] | null;

  if (error) {
    return (
      <main className="p-6 bg-gray-50 min-h-screen">
        <p className="text-red-500">Błąd: {error.message}</p>
      </main>
    );
  }

  // Oblicz statystyki
  const totalReviews = reviews?.length || 0;
  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => {
        if (!r.ratings) return sum;
        const vals = Object.values(r.ratings).filter(v => v != null) as number[];
        const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
        return sum + avg;
      }, 0) / reviews.length
    : 0;
  const uniqueStyles = new Set(reviews?.map(r => r.beer_style).filter(Boolean)).size;

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
              <span className="text-2xl">🍺</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">BeerLog</h1>
              <p className="text-sm text-gray-500">Twój dziennik piwny</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Statystyki */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="text-3xl font-bold text-amber-600">{totalReviews}</div>
              <div className="text-xs text-gray-500 mt-1">Recenzji</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="text-3xl font-bold text-amber-600">{avgRating.toFixed(1)}</div>
              <div className="text-xs text-gray-500 mt-1">Śr. ocena</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="text-3xl font-bold text-amber-600">{uniqueStyles}</div>
              <div className="text-xs text-gray-500 mt-1">Stylów</div>
            </div>
          </div>

          {/* Ostatnie recenzje */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Ostatnie recenzje
            </h2>
            <div className="space-y-3">
              {reviews?.map((review) => {
                const reviewAvg = review.ratings 
                  ? Math.round(
                      (Object.values(review.ratings).reduce((a, b) => (a || 0) + (b || 0), 0) / 
                      Object.values(review.ratings).filter(v => v != null).length) * 10
                    ) / 10
                  : 0;
                
                return (
                  <Link key={review.id} href={`/collection/${review.id}`}>
                    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer">
                    <div className="flex gap-3">
                      {review.photo_url && (
                        <img 
                          src={review.photo_url} 
                          alt={review.beer_name}
                          className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{review.beer_name}</h3>
                        <p className="text-sm text-gray-500">{review.brewery}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {review.beer_style && (
                            <span className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full">
                              {review.beer_style}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            {new Date(review.tasting_date || review.created_at).toLocaleDateString('pl-PL')}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-amber-500">⭐</span>
                          <span className="font-bold text-gray-900">{reviewAvg}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
              })}
            </div>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
