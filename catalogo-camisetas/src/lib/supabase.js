import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "Faltan PUBLIC_SUPABASE_URL o PUBLIC_SUPABASE_ANON_KEY. Copiá .env.example a .env y completá tus credenciales de Supabase."
  );
}

export const supabase = createClient(
  supabaseUrl ?? "",
  supabaseKey ?? ""
);