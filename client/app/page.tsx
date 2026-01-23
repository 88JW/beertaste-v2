// Ponieważ pliki są na tym samym poziomie co folder app, używamy ścieżki '../'
import { supabase } from '../lib/supabase'

export default async function Home() {
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*')
    .limit(10)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <main className="p-10">
        <h1 className="text-red-500">Błąd bazy: {error.message}</h1>
      </main>
    )
  }

  return (
    <main className="p-10 bg-stone-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-black mb-4">🍻 BeerTaste v2</h1>
        <p className="text-stone-500 mb-10 italic">Twoje archiwum 129 recenzji jest już online!</p>
        
        <div className="space-y-4">
          {reviews?.map((review) => (
            <div key={review.id} className="p-6 bg-white rounded-2xl shadow-sm border border-stone-200">
              <h2 className="text-xl font-bold">{review.beer_name}</h2>
              <p className="text-stone-500">{review.brewery}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-bold text-yellow-600">⭐ {review.rating}/10</span>
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