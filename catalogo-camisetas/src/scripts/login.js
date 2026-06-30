import { signIn } from "../lib/auth.js";
import { withTimeout } from "../lib/supabase.js";

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

  try {
    console.log("[login] intentando login con", { email: email.replace(/^(.)(.*)(@.*)$/, "$1***$3") });
    await withTimeout(signIn(email, password));
    console.log("[login] login exitoso, redirigiendo a /dashboard");
    window.location.href = "/dashboard";
  } catch (err) {
    console.error("[login] error:", err.message, err);
    mensaje.textContent = err.message || "Error de conexión. Intentá de nuevo.";
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Entrar";
  }
});
