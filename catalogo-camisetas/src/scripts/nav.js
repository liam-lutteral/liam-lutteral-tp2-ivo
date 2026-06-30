import { supabase } from "../lib/supabase.js";

const guestLinks = document.querySelectorAll('[data-nav="guest"]');
const authLinks = document.querySelectorAll('[data-nav="auth"]');
const logoutBtn = document.getElementById("nav-logout");
const navEmail = document.getElementById("nav-email");

async function updateNav() {
  const { data } = await supabase.auth.getSession();
  const isLoggedIn = Boolean(data.session);
  const user = data?.session?.user ?? null;

  guestLinks.forEach((el) => {
    el.hidden = isLoggedIn;
  });
  authLinks.forEach((el) => {
    el.hidden = !isLoggedIn;
  });

  if (navEmail && isLoggedIn && user?.email) {
    navEmail.textContent = user.email;
  }
}

logoutBtn?.addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "/";
});

supabase.auth.onAuthStateChange(updateNav);
updateNav();
