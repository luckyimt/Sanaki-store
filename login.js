const adminLoginForm = document.getElementById("adminLoginForm");
const loginMessage = document.getElementById("loginMessage");

const adminCredentials = {
  email: "admin@example.com",
  password: "admin123"
};

adminLoginForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value.trim();

  if (
    email === adminCredentials.email &&
    password === adminCredentials.password
  ) {
    localStorage.setItem("adminLoggedIn", "true");

    loginMessage.style.color = "#16a34a";
    loginMessage.textContent = "Login successful. Redirecting...";

    setTimeout(() => {
      window.location.href = "admin-dashboard.html";
    }, 1200);
  } else {
    loginMessage.style.color = "#dc2626";
    loginMessage.textContent = "Invalid email or password.";
  }
});

if (localStorage.getItem("adminLoggedIn") === "true") {
  window.location.href = "admin-dashboard.html";
}