import { signUp } from "../lib/auth.js";
import { withTimeout } from "../lib/supabase.js";

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

  try {
    console.log("[register] intentando registrar", { email: email.replace(/^(.)(.*)(@.*)$/, "$1***$3") });
    await withTimeout(signUp(email, password));
    console.log("[register] registro exitoso");
    mensaje.textContent = "Cuenta creada. Revisá tu mail o iniciá sesión.";
  } catch (err) {
    console.error("[register] error:", err.message, err);
    mensaje.textContent = err.message || "Error de conexión. Intentá de nuevo.";
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Registrarme";
  }
});
