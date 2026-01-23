export const dynamic = 'force-dynamic' // To naprawi build!

import { supabase } from '../lib/supabase'

// Definiujemy kształt danych, aby TS nie zgadywał
interface BeerReview {
  id: string | number;
  beer_name: string;
  brewery: string;
  rating: number;
  created_at: string;
  comment?: string;
}

export default async function Home() {
  // Wykonujemy zapytanie
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .limit(10)
    .order('created_at', { ascending: false })

  // Rzutujemy dane na nasz interfejs (to uciszy błąd 'never')
  const reviews = data as BeerReview[] | null;

  if (error) {
    return <div className="p-10 text-red-500">Błąd: {error.message}</div>
  }

  return (
    <main className="p-10 bg-stone-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-black mb-4 text-stone-900">🍻 BeerTaste v2</h1>
        <p className="text-stone-500 mb-10 italic">Twoje archiwum 129 recenzji ożyło!</p>
        
        <div className="space-y-4">
          {reviews?.map((review) => (
            <div key={review.id} className="p-6 bg-white rounded-2xl shadow-sm border border-stone-200">
              <h2 className="text-xl font-bold text-stone-800">{review.beer_name}</h2>
              <p className="text-stone-500">{review.brewery}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-bold">
                  ⭐ {review.rating}/10
                </span>
                <span className="text-xs text-stone-400">
                  {new Date(review.created_at).toLocaleDateString('pl-PL')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}