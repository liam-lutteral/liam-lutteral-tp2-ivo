import { signOut, getUser } from "../lib/auth.js";
import { supabase } from "../lib/supabase.js";

const guestLinks = document.querySelectorAll('[data-nav="guest"]');
const authLinks = document.querySelectorAll('[data-nav="auth"]');
const logoutBtn = document.getElementById("nav-logout");

async function updateNav() {
  try {
    const user = await getUser();
    const isLoggedIn = Boolean(user);

    // Sin sesión: "Iniciar sesión" y "Registro".
    // Con sesión: "Bienvenido" + "Cerrar sesión" + links del catálogo.
    guestLinks.forEach((el) => {
      el.hidden = isLoggedIn;
    });
    authLinks.forEach((el) => {
      el.hidden = !isLoggedIn;
    });
  } catch (err) {
    // Silently ignore nav update errors — the page content handles its own auth.
  }
}

logoutBtn?.addEventListener("click", async () => {
  try {
    await signOut();
    window.location.href = "/";
  } catch (err) {
    // Logout failed — best-effort redirect anyway.
    window.location.href = "/";
  }
});

const { data: { subscription } } = supabase.auth.onAuthStateChange(updateNav);
updateNav();

// Clean up listener if Astro View Transitions swap the page.
document.addEventListener("astro:before-swap", () => {
  subscription.unsubscribe();
});
