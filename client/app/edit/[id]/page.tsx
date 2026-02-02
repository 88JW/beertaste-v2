'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import AuthGuard from '@/components/AuthGuard';

const beerStyles = [
  'IPA', 'New England IPA', 'West Coast IPA', 'Double IPA',
  'Baltic Porter', 'Imperial Stout', 'Milk Stout',
  'Lager', 'Pilsner', 'Helles',
  'Hefeweizen', 'Wheat Beer', 'Witbier',
  'Sour', 'Gose', 'Berliner Weisse',
  'Pale Ale', 'Amber Ale', 'Brown Ale',
  'Saison', 'Belgian Blonde', 'Belgian Dubbel', 'Belgian Tripel',
  'Barleywine', 'Imperial Porter'
];

export default function EditReviewPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    beer_name: '',
    brewery: '',
    beer_style: '',
    appearance: 0,
    aroma: 0,
    taste: 0,
    mouthfeel: 0,
    note: '',
  });

  useEffect(() => {
    const fetchReview = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error || !data) {
        alert('Nie znaleziono recenzji');
        router.push('/collection');
        return;
      }

      // Sprawdź czy użytkownik jest właścicielem
      if (data.user_id !== user?.id) {
        alert('Nie masz uprawnień do edycji tej recenzji');
        router.push('/collection');
        return;
      }

      setFormData({
        beer_name: data.beer_name || '',
        brewery: data.brewery || '',
        beer_style: data.style || '',
        appearance: data.ratings?.appearance || 0,
        aroma: data.ratings?.aroma || 0,
        taste: data.ratings?.taste || 0,
        mouthfeel: data.ratings?.mouthfeel || 0,
        note: data.note || '',
      });

      if (data.photo_url) {
        setExistingPhotoUrl(data.photo_url);
        setPhotoPreview(data.photo_url);
      }

      setLoadingData(false);
    };

    if (user) {
      fetchReview();
    }
  }, [params.id, user, router]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('beer-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('beer-photos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Musisz być zalogowany');
      return;
    }

    if (!formData.beer_name || !formData.brewery) {
      alert('Wypełnij nazwę piwa i browaru');
      return;
    }

    if (formData.appearance === 0 || formData.aroma === 0 || formData.taste === 0 || formData.mouthfeel === 0) {
      alert('Wypełnij wszystkie oceny');
      return;
    }

    setLoading(true);

    try {
      let photoUrl = existingPhotoUrl;
      
      // Upload nowego zdjęcia jeśli zostało wybrane
      if (photoFile) {
        // Usuń stare zdjęcie jeśli istnieje
        if (existingPhotoUrl) {
          const oldFileName = existingPhotoUrl.split('/').pop();
          if (oldFileName) {
            await supabase.storage.from('beer-photos').remove([oldFileName]);
          }
        }
        
        photoUrl = await uploadPhoto(photoFile);
      }

      const { error } = await supabase
        .from('reviews')
        .update({
          beer_name: formData.beer_name,
          brewery: formData.brewery,
          style: formData.beer_style || null,
          ratings: {
            appearance: formData.appearance,
            aroma: formData.aroma,
            taste: formData.taste,
            mouthfeel: formData.mouthfeel,
          },
          note: formData.note || null,
          photo_url: photoUrl,
        })
        .eq('id', params.id);

      if (error) throw error;

      router.push(`/collection/${params.id}`);
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Błąd podczas aktualizacji recenzji: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-gray-700">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="text-2xl transition-transform hover:scale-110"
          >
            {star <= value ? '⭐' : '☆'}
          </button>
        ))}
      </div>
    </div>
  );

  if (loadingData) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Ładowanie...</div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="bg-white/80 backdrop-blur-sm px-6 py-4 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-900">Edytuj recenzję</h1>
          <p className="text-sm text-gray-500">Zaktualizuj swoją ocenę</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 pb-24">
          {/* Upload zdjęcia */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-amber-500 transition">
                {photoPreview ? (
                  <div className="relative">
                    <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setPhotoFile(null);
                        setPhotoPreview(null);
                        setExistingPhotoUrl(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div>
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">Dodaj zdjęcie piwa</p>
                    <p className="mt-1 text-xs text-gray-400">PNG, JPG do 10MB</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Podstawowe informacje */}
          <div className="bg-white rounded-2xl p-4 space-y-4 shadow-sm">
            <input
              type="text"
              placeholder="Nazwa piwa"
              required
              value={formData.beer_name}
              onChange={(e) => setFormData({ ...formData, beer_name: e.target.value })}
              className="w-full px-4 py-3 bg-amber-50 border-0 rounded-xl focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
            />

            <input
              type="text"
              placeholder="Browar"
              required
              value={formData.brewery}
              onChange={(e) => setFormData({ ...formData, brewery: e.target.value })}
              className="w-full px-4 py-3 bg-amber-50 border-0 rounded-xl focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
            />

            <select
              value={formData.beer_style}
              onChange={(e) => setFormData({ ...formData, beer_style: e.target.value })}
              className="w-full px-4 py-3 bg-amber-50 border-0 rounded-xl focus:ring-2 focus:ring-amber-500 text-gray-700"
            >
              <option value="">Wybierz styl</option>
              {beerStyles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          {/* Oceny */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Ocena ogólna</h2>
              <span className="text-amber-500 text-xl">⭐</span>
            </div>

            <div className="divide-y divide-gray-100">
              <StarRating
                label="Wygląd"
                value={formData.appearance}
                onChange={(v) => setFormData({ ...formData, appearance: v })}
              />
              <StarRating
                label="Aromat"
                value={formData.aroma}
                onChange={(v) => setFormData({ ...formData, aroma: v })}
              />
              <StarRating
                label="Smak"
                value={formData.taste}
                onChange={(v) => setFormData({ ...formData, taste: v })}
              />
              <StarRating
                label="Odczucie"
                value={formData.mouthfeel}
                onChange={(v) => setFormData({ ...formData, mouthfeel: v })}
              />
            </div>
          </div>

          {/* Notatki */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <textarea
              placeholder="Notatki degustacyjne..."
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-amber-50 border-0 rounded-xl focus:ring-2 focus:ring-amber-500 placeholder-gray-400 resize-none"
            />
          </div>

          {/* Przyciski */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-300 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-400 transition"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 rounded-2xl hover:from-amber-600 hover:to-orange-600 transition disabled:opacity-50 shadow-lg"
            >
              {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </button>
          </div>
        </form>
      </main>
    </AuthGuard>
  );
}
