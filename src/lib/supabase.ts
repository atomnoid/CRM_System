import { createClient } from "@supabase/supabase-js";

// Define the database schema for TypeScript
type Database = {
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
      };
    };
  };
};

let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabase() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}
