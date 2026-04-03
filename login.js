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

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginEmail.value.trim().toLowerCase();
  const password = loginPassword.value.trim();

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const matchedUser = users.find(user => {
    return user.email.toLowerCase() === email && user.password === password;
  });

  if (!matchedUser) {
    loginMessage.textContent = "Invalid email or password.";
    loginMessage.style.color = "#dc2626";
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(matchedUser));
  localStorage.setItem("isLoggedIn", "true");

  if (document.getElementById("rememberMe").checked) {
    localStorage.setItem("rememberedEmail", matchedUser.email);
  } else {
    localStorage.removeItem("rememberedEmail");
  }

  loginMessage.textContent = "Login successful. Redirecting...";
  loginMessage.style.color = "#16a34a";

  setTimeout(() => {
    if (matchedUser.role === "admin") {
      localStorage.setItem("adminLoggedIn", "true");
      window.location.href = "admin-dashboard.html";
    } else {
      window.location.href = "shop.html";
    }
  }, 1200);
});

window.addEventListener("DOMContentLoaded", () => {
  const rememberedEmail = localStorage.getItem("rememberedEmail");

  if (rememberedEmail) {
    loginEmail.value = rememberedEmail;
    document.getElementById("rememberMe").checked = true;
  }
});

const defaultUsers = [
  {
    id: 1,
    fullName: "Admin User",
    email: "admin@shop.com",
    password: "admin123",
    role: "admin"
  },
  {
    id: 2,
    fullName: "Customer User",
    email: "customer@shop.com",
    password: "customer123",
    role: "customer"
  }
];

if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify(defaultUsers));
}

//-admin nav
function setActiveSidebarLink() {
  const links = document.querySelectorAll(".sidebar-link");
  const currentPage = window.location.pathname.split("/").pop();

  links.forEach(link => {
    const href = link.getAttribute("href");

    if (href === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setActiveSidebarLink();
});