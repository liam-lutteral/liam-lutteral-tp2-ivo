import { supabase } from "../lib/supabase.js";

const form = document.getElementById("login-form");
const mensaje = document.getElementById("mensaje");
const submitBtn = form?.querySelector("button[type='submit']");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Entrando...";
  }
  mensaje.textContent = "";

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    mensaje.textContent = error.message;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Entrar";
    }
  } else {
    window.location.href = "/dashboard";
  }
});
