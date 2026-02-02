'use client';

import { supabase } from '@/lib/supabase';
import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface BeerReview {
  id: string;
  beer_name: string;
  brewery: string;
  style?: string;
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

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [review, setReview] = useState<BeerReview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error || !data) {
        router.push('/collection');
        return;
      }

      setReview(data as BeerReview);
      setLoading(false);
    };

    fetchReview();
  }, [params.id, router]);

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Ładowanie...</div>
        </div>
      </AuthGuard>
    );
  }

  if (!review) {
    return null;
  }

  const typedReview = review;

  const calculateAvg = (ratings?: BeerReview['ratings']) => {
    if (!ratings) return 0;
    const vals = Object.values(ratings).filter((v) => v != null) as number[];
    return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  };

  const avgRating = calculateAvg(typedReview.ratings);

  const handleDelete = async () => {
    if (!confirm('Czy na pewno chcesz usunąć tę recenzję?')) {
      return;
    }

    try {
      // Usuń zdjęcie jeśli istnieje
      if (review.photo_url) {
        const fileName = review.photo_url.split('/').pop();
        if (fileName) {
          await supabase.storage.from('beer-photos').remove([fileName]);
        }
      }

      // Usuń recenzję
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', review.id);

      if (error) throw error;

      router.push('/collection');
    } catch (error) {
      console.error('Błąd podczas usuwania:', error);
      alert('Nie udało się usunąć recenzji');
    }
  };

  const handleEdit = () => {
    router.push(`/edit/${review.id}`);
  };

  const RatingRow = ({ label, value }: { label: string; value?: number }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-gray-700">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-xl">
            {star <= (value || 0) ? '⭐' : '☆'}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm px-6 py-4 sticky top-0 z-10 flex items-center gap-3">
          <Link href="/collection" className="text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{typedReview.beer_name}</h1>
            <p className="text-sm text-gray-500">{typedReview.brewery}</p>
          </div>
        </div>

        <div className="p-6 space-y-4 pb-24">
          {/* Zdjęcie */}
          {typedReview.photo_url && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <img
                src={typedReview.photo_url}
                alt={typedReview.beer_name}
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
          )}

          {/* Podstawowe informacje */}
          <div className="bg-white rounded-2xl p-4 space-y-3 shadow-sm">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide">Nazwa piwa</label>
              <p className="text-lg font-bold text-gray-900">{typedReview.beer_name}</p>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide">Browar</label>
              <p className="text-lg text-gray-900">{typedReview.brewery}</p>
            </div>

            {typedReview.style && (
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">Styl</label>
                <p className="inline-block mt-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                  {typedReview.style}
                </p>
              </div>
            )}

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide">Data degustacji</label>
              <p className="text-gray-900">
                {new Date(typedReview.tasting_date || typedReview.created_at).toLocaleDateString('pl-PL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Oceny */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Ocena ogólna</h2>
              <div className="flex items-center gap-2">
                <span className="text-amber-500 text-2xl">⭐</span>
                <span className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</span>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              <RatingRow label="Wygląd" value={typedReview.ratings?.appearance} />
              <RatingRow label="Aromat" value={typedReview.ratings?.aroma} />
              <RatingRow label="Smak" value={typedReview.ratings?.taste} />
              <RatingRow label="Odczucie" value={typedReview.ratings?.mouthfeel} />
            </div>
          </div>

          {/* Notatki */}
          {typedReview.note && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Notatki degustacyjne
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">{typedReview.note}</p>
            </div>
          )}

          {/* Przyciski akcji */}
          <div className="flex gap-3">
            <button 
              onClick={handleEdit}
              className="flex-1 bg-amber-500 text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition"
            >
              Edytuj
            </button>
            <button 
              onClick={handleDelete}
              className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition"
            >
              Usuń
            </button>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
