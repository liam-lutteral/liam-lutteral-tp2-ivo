import { supabase } from "./supabase.js";

/**
 * Iniciar sesión con email y contraseña.
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) { throw error; }
  return data;
}

/**
 * Registrar un nuevo usuario.
 */
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) { throw error; }
  return data;
}

/**
 * Cerrar sesión.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) { throw error; }
}

/**
 * Obtener el usuario autenticado actual.
 * Retorna null si no hay sesión activa.
 */
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    if (/auth session|jwt|token|expired|refresh/i.test(error.message)) {
      return null;
    }
    throw error;
  }

  return data?.user ?? null;
}

/**
 * Obtener la sesión actual.
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) { throw error; }
  return data?.session ?? null;
}
