import { supabase } from "../lib/supabase.js";

const form = document.getElementById("register-form");
const mensaje = document.getElementById("mensaje");
const submitBtn = form?.querySelector("button[type='submit']");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Registrando...";
  }
  mensaje.textContent = "";

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    mensaje.textContent = error.message;
  } else {
    mensaje.textContent = "Cuenta creada. Revisá tu mail o iniciá sesión.";
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Registrarme";
  }
});
