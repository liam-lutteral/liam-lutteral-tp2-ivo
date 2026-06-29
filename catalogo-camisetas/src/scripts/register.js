import { supabase } from "../lib/supabase.js";

const form = document.getElementById("register-form");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    mensaje.textContent = error.message;
  } else {
    mensaje.textContent = "Cuenta creada. Revisá tu mail o iniciá sesión.";
  }
});
