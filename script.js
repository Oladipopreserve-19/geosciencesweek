/* ============================================================
   Geosciences Week 2026 — Registration form handler
   ------------------------------------------------------------
   1. Deploy Code.gs as a Google Apps Script Web App.
   2. Paste the deployment URL below as SCRIPT_URL.
   ============================================================ */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyKjkeUrwU0BW1dogCD76mkyzrgzKsbgMA7RF3oKM28ZmcSy2FAOR2ZskOXJr0vr8uC/exec";

const form = document.getElementById("registration-form");
const submitBtn = document.getElementById("submitBtn");
const formError = document.getElementById("formError");
function showError(message) {
  formError.textContent = message;
  formError.hidden = false;
  formError.scrollIntoView({ behavior: "smooth", block: "center" });
}

function clearError() {
  formError.hidden = true;
  formError.textContent = "";
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.classList.toggle("loading", isLoading);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearError();

  // Native HTML5 validation first.
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = {
    firstName: form.firstName.value.trim(),
    lastName: form.lastName.value.trim(),
    matricNumber: form.matricNumber.value.trim(),
    level: form.level.value,
    department: form.department.value,
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
  };

  if (SCRIPT_URL.includes("PASTE_YOUR")) {
    showError(
      "Setup incomplete: the registration endpoint has not been configured yet."
    );
    return;
  }

  setLoading(true);

  try {
    // Apps Script web apps don't return CORS headers, so we use no-cors.
    // The request still reaches the server (saves row + sends email).
    // Content-Type text/plain keeps it a "simple" request (no preflight).
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data),
    });

    // Redirect to success page, passing the first name for personalization.
    const params = new URLSearchParams({ name: data.firstName });
    window.location.href = `success.html?${params.toString()}`;
  } catch (err) {
    setLoading(false);
    showError(
      "Something went wrong while submitting. Please check your connection and try again."
    );
  }
});
