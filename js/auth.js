import { saveToLocal, getFromLocal } from "./storage.js";
import { showToast } from "./utils.js";

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

// Toggle Screens
document.getElementById("to-register")?.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
});
document.getElementById("to-login")?.addEventListener("click", () => {
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

// Register Logic
registerForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("reg-user").value.trim();
  const pass = document.getElementById("reg-pass").value.trim();
  const role = document.getElementById("reg-role").value;

  if (!user || !pass) return showToast("Please fill all fields", "error");

  // 1. هات المستخدمين القدام
  let db = getFromLocal("users_db");
  if (!Array.isArray(db)) {
    db = db && typeof db === "object" ? Object.values(db) : [];
  }

  // 2. اتأكد إن الاسم مش موجود
  if (db.find((u) => u.username === user)) {
    return showToast("Username already exists!", "error");
  }

  // 3. ضيف الجديد
  db.push({ username: user, password: pass, role: role });

  // 4. احفظ القائمة كاملة
  saveToLocal("users_db", db);

  showToast("Account Created Successfully!", "success");

  setTimeout(() => {
    document.getElementById("to-login").click();
  }, 1500);
});

// Login Logic
loginForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("log-user").value.trim();
  const pass = document.getElementById("log-pass").value.trim();

  let db = getFromLocal("users_db");
  if (!Array.isArray(db)) {
    db = db && typeof db === "object" ? Object.values(db) : [];
  }
  const account = db.find((u) => u.username === user && u.password === pass);

  if (account) {
    sessionStorage.setItem("currentUser", JSON.stringify(account));
    showToast("Login Successful", "success");

    setTimeout(() => {
      window.location.href =
        account.role === "admin" ? "dashboard.html" : "pos.html";
    }, 1000);
  } else {
    showToast("Invalid Username or Password!", "error");
  }
});
