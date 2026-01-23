import { createClient } from '@supabase/supabase-js'

// Pobieramy zmienne, ale dodajemy "placeholder", żeby build nie wybuchł
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)