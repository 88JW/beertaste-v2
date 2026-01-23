export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      reviews: {
        Row: {
          id: string
          user_id: string | null
          beer_name: string | null
          brewery: string | null
          rating: number | null
          comment: string | null
          created_at: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          beer_name?: string | null
          brewery?: string | null
          rating?: number | null
          comment?: string | null
          created_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string | null
          beer_name?: string | null
          brewery?: string | null
          rating?: number | null
          comment?: string | null
          created_at?: string
          metadata?: Json | null
        }
      }
    }
  }
}