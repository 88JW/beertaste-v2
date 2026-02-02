'use client';

import { useAuth } from '@/lib/auth';

export default function LogoutButton() {
  const { signOut, user } = useAuth();

  if (!user) return null;

  return (
    <button
      onClick={() => signOut()}
      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition"
    >
      Wyloguj
    </button>
  );
}
