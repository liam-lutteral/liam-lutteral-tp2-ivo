import { signUp } from "../lib/auth.js";
import { withTimeout } from "../lib/supabase.js";
import { friendlyError } from "../lib/validation.js";

const form = document.getElementById("register-form");
const mensaje = document.getElementById("mensaje");
const submitBtn = form?.querySelector("button[type='submit']");

if (!form || !mensaje) {
  console.error("[register] Required DOM elements not found");
} else {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (password.length < 8) {
      mensaje.textContent = "La contraseña debe tener al menos 8 caracteres.";
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Registrando...";
    }
    mensaje.textContent = "";

    try {
      await withTimeout(signUp(email, password));
      mensaje.textContent = "Cuenta creada. Revisá tu mail o iniciá sesión.";
    } catch (err) {
      mensaje.textContent = friendlyError(err) || "Error de conexión. Intentá de nuevo.";
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Registrarme";
    }
  });
}
