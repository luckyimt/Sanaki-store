const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginMessage = document.getElementById("loginMessage");
const togglePasswordBtn = document.getElementById("togglePasswordBtn");

togglePasswordBtn.addEventListener("click", () => {
  if (loginPassword.type === "password") {
    loginPassword.type = "text";
    togglePasswordBtn.textContent = "Hide";
  } else {
    loginPassword.type = "password";
    togglePasswordBtn.textContent = "Show";
  }
});