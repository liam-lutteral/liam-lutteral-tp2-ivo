import { supabase } from "./supabase.js";

/**
 * Iniciar sesión con email y contraseña.
 */
export async function signIn(email, password) {
  console.log("[auth] signIn iniciado", { email: email.replace(/^(.)(.*)(@.*)$/, "$1***$3") });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("[auth] signIn ERROR:", error.message, error);
    throw error;
  }

  console.log("[auth] signIn OK — sesión creada para", data.user?.email);
  return data;
}

/**
 * Registrar un nuevo usuario.
 */
export async function signUp(email, password) {
  console.log("[auth] signUp iniciado", { email: email.replace(/^(.)(.*)(@.*)$/, "$1***$3") });
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error("[auth] signUp ERROR:", error.message, error);
    throw error;
  }

  console.log("[auth] signUp OK — usuario creado:", data.user?.id);
  return data;
}

/**
 * Cerrar sesión.
 */
export async function signOut() {
  console.log("[auth] signOut");
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("[auth] signOut ERROR:", error.message, error);
    throw error;
  }

  console.log("[auth] signOut OK");
}

/**
 * Obtener el usuario autenticado actual.
 * Retorna null si no hay sesión activa.
 */
export async function getUser() {
  console.log("[auth] getUser");
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("[auth] getUser ERROR:", error.message, error);
    throw error;
  }

  const user = data?.user ?? null;
  console.log("[auth] getUser:", user ? `usuario ${user.id} (${user.email})` : "sin sesión");
  return user;
}

/**
 * Obtener la sesión actual.
 * Retorna null si no hay sesión activa.
 */
export async function getSession() {
  console.log("[auth] getSession");
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("[auth] getSession ERROR:", error.message, error);
    throw error;
  }

  const session = data?.session ?? null;
  console.log("[auth] getSession:", session ? `sesión activa (${session.user?.email})` : "sin sesión");
  return session;
}
