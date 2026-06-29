import { supabase } from "../lib/supabase.js";

const guestLinks = document.querySelectorAll('[data-nav="guest"]');
const authLinks = document.querySelectorAll('[data-nav="auth"]');
const logoutBtn = document.getElementById("nav-logout");

async function updateNav() {
  const { data } = await supabase.auth.getSession();
  const isLoggedIn = Boolean(data.session);

  guestLinks.forEach((el) => {
    el.hidden = isLoggedIn;
  });
  authLinks.forEach((el) => {
    el.hidden = !isLoggedIn;
  });
}

logoutBtn?.addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "/";
});

supabase.auth.onAuthStateChange(updateNav);
updateNav();
