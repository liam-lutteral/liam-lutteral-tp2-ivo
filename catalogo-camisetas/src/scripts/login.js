import { signIn } from "../lib/auth.js";
import { withTimeout } from "../lib/supabase.js";
import { friendlyError } from "../lib/validation.js";

const form = document.getElementById("login-form");
const mensaje = document.getElementById("mensaje");
const submitBtn = form?.querySelector("button[type='submit']");

if (!form || !mensaje) {
  console.error("[login] Required DOM elements not found");
} else {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Entrando...";
    }
    mensaje.textContent = "";

    try {
      await withTimeout(signIn(email, password));
      window.location.href = "/dashboard";
    } catch (err) {
      mensaje.textContent = friendlyError(err) || "Error de conexión. Intentá de nuevo.";
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Entrar";
    }
  });
}
