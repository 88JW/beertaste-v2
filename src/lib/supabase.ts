import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Pobieramy dane z Twojego pliku .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Tworzymy otypowanego klienta
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)