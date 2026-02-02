'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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

export default function CollectionPage() {
  const [reviews, setReviews] = useState<BeerReview[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'best'>('newest');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [sortBy]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      let query = supabase.from('reviews').select('*');

      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.beer_name.toLowerCase().includes(search.toLowerCase()) ||
      review.brewery.toLowerCase().includes(search.toLowerCase());
    const matchesStyle = !selectedStyle || review.beer_style === selectedStyle;
    return matchesSearch && matchesStyle;
  });

  const styles = Array.from(new Set(reviews.map((r) => r.beer_style).filter(Boolean)));

  const calculateAvg = (ratings?: BeerReview['ratings']) => {
    if (!ratings) return 0;
    const vals = Object.values(ratings).filter((v) => v != null) as number[];
    return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="bg-white/80 backdrop-blur-sm px-6 py-4 sticky top-0 z-10 space-y-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Moja kolekcja</h1>
            <p className="text-sm text-gray-500">{filteredReviews.length} recenzji</p>
          </div>

          {/* Wyszukiwarka */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="search"
                placeholder="Szukaj piwa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>

          {/* Sortowanie */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('newest')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                sortBy === 'newest'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-gray-600'
              }`}
            >
              Najnowsze
            </button>
            <button
              onClick={() => setSortBy('best')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                sortBy === 'best'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-gray-600'
              }`}
            >
              Najlepsze
            </button>
          </div>

          {/* Filtry stylów */}
          {styles.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
              <button
                onClick={() => setSelectedStyle('')}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  !selectedStyle ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                Wszystkie
              </button>
              {styles.slice(0, 5).map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style === selectedStyle ? '' : (style || ''))}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    selectedStyle === style ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 border border-gray-200'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Ładowanie...</div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Brak recenzji</div>
          ) : (
            filteredReviews.map((review) => {
              const avg = calculateAvg(review.ratings);
              return (
                <Link key={review.id} href={`/collection/${review.id}`}>
                  <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer">
                    <div className="flex gap-3">
                      {review.photo_url && (
                        <img
                          src={review.photo_url}
                          alt={review.beer_name}
                          className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate">{review.beer_name}</h3>
                          <p className="text-sm text-gray-500">{review.brewery}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-amber-500">⭐</span>
                          <span className="font-bold text-gray-900">{avg.toFixed(1)}</span>
                        </div>
                      </div>
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
                      {review.note && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{review.note}</p>
                      )}
                      {review.ratings && (
                        <div className="flex gap-4 mt-3 text-xs text-gray-500">
                          <div>
                            <span className="font-medium">Wygląd</span>
                            <span className="ml-1">{review.ratings.appearance}</span>
                          </div>
                          <div>
                            <span className="font-medium">Aromat</span>
                            <span className="ml-1">{review.ratings.aroma}</span>
                          </div>
                          <div>
                            <span className="font-medium">Smak</span>
                            <span className="ml-1">{review.ratings.taste}</span>
                          </div>
                          <div>
                            <span className="font-medium">Odczucie</span>
                            <span className="ml-1">{review.ratings.mouthfeel}</span>
                          </div>
                        </div>
                      )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
