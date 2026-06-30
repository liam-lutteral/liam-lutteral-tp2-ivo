import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Faltan PUBLIC_SUPABASE_URL o PUBLIC_SUPABASE_ANON_KEY. " +
    "Copiá .env.example a .env y completá tus credenciales de Supabase."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Aumentamos el timeout a 30s porque Supabase free tier puede tardar
// en "despertar" si el proyecto estuvo inactivo.
export async function withTimeout(promise, ms = 30000) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(
      () =>
        reject(
          new Error(
            `La operación tardó demasiado (${ms / 1000}s). ` +
            `Si es la primera vez hoy, Supabase puede tardar en responder. ` +
            `Intentá de nuevo.`
          )
        ),
      ms
    )
  );
  return Promise.race([promise, timeoutPromise]);
}