import { signOut, getSession } from "../lib/auth.js";
import { supabase } from "../lib/supabase.js";

const guestLinks = document.querySelectorAll('[data-nav="guest"]');
const authLinks = document.querySelectorAll('[data-nav="auth"]');
const logoutBtn = document.getElementById("nav-logout");
const navEmail = document.getElementById("nav-email");

async function updateNav() {
  try {
    const session = await getSession();
    const isLoggedIn = Boolean(session);
    const user = session?.user ?? null;

    guestLinks.forEach((el) => {
      el.hidden = isLoggedIn;
    });
    authLinks.forEach((el) => {
      el.hidden = !isLoggedIn;
    });

    if (navEmail && isLoggedIn && user?.email) {
      navEmail.textContent = user.email;
    }
  } catch (err) {
    console.error("[nav] error al actualizar navbar:", err.message, err);
  }
}

logoutBtn?.addEventListener("click", async () => {
  try {
    console.log("[nav] cerrando sesión");
    await signOut();
    window.location.href = "/";
  } catch (err) {
    console.error("[nav] error al cerrar sesión:", err.message, err);
  }
});

supabase.auth.onAuthStateChange(updateNav);
updateNav();
