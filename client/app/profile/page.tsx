'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import AuthGuard from '@/components/AuthGuard';
import { useRouter } from 'next/navigation';

interface Stats {
  totalReviews: number;
  avgRating: number;
  daysActive: number;
  badges: number;
}

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalReviews: 0,
    avgRating: 0,
    daysActive: 0,
    badges: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: reviews } = await supabase.from('reviews').select('*');

      if (reviews && reviews.length > 0) {
        const total = reviews.length;
        const avg =
          reviews.reduce((sum, r) => {
            if (!r.ratings) return sum;
            const vals = Object.values(r.ratings).filter((v) => v != null) as number[];
            const ravg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
            return sum + ravg;
          }, 0) / total;

        const dates = reviews.map((r) => new Date(r.created_at).getTime());
        const minDate = Math.min(...dates);
        const maxDate = Math.max(...dates);
        const days = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));

        setStats({
          totalReviews: total,
          avgRating: avg,
          daysActive: days || 1,
          badges: total >= 10 ? 3 : total >= 5 ? 2 : total >= 1 ? 1 : 0,
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/auth');
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="bg-white/80 backdrop-blur-sm px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <span className="text-3xl">🍺</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Piwosz</h1>
              <p className="text-sm text-gray-500">Członek od 2024</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Statystyki */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalReviews}</div>
              <div className="text-xs text-gray-500">Recenzji</div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</div>
              <div className="text-xs text-gray-500">Śr. ocena</div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.daysActive}</div>
              <div className="text-xs text-gray-500">Dni aktywności</div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.badges}</div>
              <div className="text-xs text-gray-500">Odznaki</div>
            </div>
          </div>

          {/* Odznaki */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Odznaki</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              <div className="bg-white rounded-2xl p-4 text-center min-w-[100px] shadow-sm">
                <div className="text-3xl mb-2">🍺</div>
                <div className="text-xs font-medium text-gray-700">Początkujący</div>
              </div>
              {stats.totalReviews >= 5 && (
                <div className="bg-white rounded-2xl p-4 text-center min-w-[100px] shadow-sm">
                  <div className="text-3xl mb-2">⭐</div>
                  <div className="text-xs font-medium text-gray-700">Smakosz</div>
                </div>
              )}
              {stats.totalReviews >= 10 && (
                <div className="bg-white rounded-2xl p-4 text-center min-w-[100px] shadow-sm">
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="text-xs font-medium text-gray-700">Ekspert IPA</div>
                </div>
              )}
            </div>
          </div>

          {/* Ustawienia i wylogowanie */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium text-gray-700">Ustawienia</span>
            </button>

            <div className="border-t border-gray-100"></div>

            <button
              onClick={handleLogout}
              className="w-full px-6 py-4 flex items-center gap-3 hover:bg-red-50 transition text-red-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Wyloguj się</span>
            </button>
          </div>

          <div className="text-center text-xs text-gray-400 py-4">
            <p>BeerLog v2.0</p>
            <p className="mt-1">{user?.email}</p>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
