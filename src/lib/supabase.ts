import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Define the database schema for TypeScript
export type Database = {
  public: {
    Tables: {
      students: {
        Row: {
          id: string;
          name: string;
          class: string;
          monthly_fee: number;
          fee_paid: boolean;
          paid_till_month: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          class: string;
          monthly_fee: number;
          fee_paid: boolean;
          paid_till_month?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          class?: string;
          monthly_fee?: number;
          fee_paid?: boolean;
          paid_till_month?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      teachers: {
        Row: {
          id: string;
          name: string;
          subject: string;
          monthly_salary: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          subject: string;
          monthly_salary: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          subject?: string;
          monthly_salary?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
  };
};

let supabaseInstance: SupabaseClient<Database> | null = null;

export function getSupabase(): SupabaseClient<Database> {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY/SUPABASE_ANON_KEY in your environment.");
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

