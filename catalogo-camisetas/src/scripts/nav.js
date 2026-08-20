import { signOut } from "../lib/auth.js";
import { supabase } from "../lib/supabase.js";

const guestLinks = document.querySelectorAll('[data-nav="guest"]');
const authLinks = document.querySelectorAll('[data-nav="auth"]');
const logoutBtn = document.getElementById("nav-logout");

function setNavLoggedIn(isLoggedIn) {
  guestLinks.forEach((el) => { el.hidden = isLoggedIn; });
  authLinks.forEach((el) => { el.hidden = !isLoggedIn; });
}

async function updateNav() {
  try {
    // Use getSession() (local cache) instead of getUser() (server call)
    // to avoid deadlocking the Supabase client's internal event loop.
    const { data } = await supabase.auth.getSession();
    setNavLoggedIn(Boolean(data?.session));
  } catch {
    setNavLoggedIn(false);
  }
}

logoutBtn?.addEventListener("click", async () => {
  try {
    await signOut();
    window.location.href = "/";
  } catch {
    window.location.href = "/";
  }
});

// Listen for auth changes — use getSession (local) not getUser (server)
// to prevent re-entrant deadlocks when setSession triggers SIGNED_IN.
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (_event, session) => {
    setNavLoggedIn(Boolean(session));
  }
);
updateNav();

document.addEventListener("astro:before-swap", () => {
  subscription.unsubscribe();
});
