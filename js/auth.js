/*******
  Dependencies
********/

import { saveToLocal, getFromLocal } from "./storage.js";
import { showToast } from "./toast.js";


/*******
  DOM Binding
********/

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const goToRegisterBtn = document.getElementById("goToRegister");
const goToLoginBtn = document.getElementById("goToLogin");


/*******
 Toggle Login/Register
********/

goToRegisterBtn.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
});

goToLoginBtn.addEventListener("click", () => {
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});


/*******
 Register Flow
********/

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // قراءة المدخلات
  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const role = document.getElementById("regRole").value.trim();

  // التحقق من الإدخال
  if (!username  !password  !role) {
    showToast("Please fill all fields", "error");
    return;
  }

  // جلب قاعدة المستخدمين
  let users = getFromLocal("users_db");

  if (!Array.isArray(users)) {
    if (users && typeof users === "object") {
      users = Object.values(users);
    } else {
      users = [];
    }
  }

  // التحقق من التكرار
  const exists = users.find((u) => u.username === username);

  if (exists) {
    showToast("Username already exists!", "error");
    return;
  }

  // إضافة المستخدم
  const newUser = { username, password, role };
  users.push(newUser);

  // حفظ في LocalStorage
  saveToLocal("users_db", users);

  // نجاح
  showToast("Account Created Successfully!", "success");

  // تحويل لشاشة Login بعد تأخير
  setTimeout(() => {
    goToLoginBtn.click();
  }, 1200);
});


/*******
 Login Flow
********/

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  // جلب قاعدة البيانات
  let users = getFromLocal("users_db");

  if (!Array.isArray(users)) {
    if (users && typeof users === "object") {
      users = Object.values(users);
    } else {
      users = [];
    }
  }

  // البحث عن الحساب
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  // فشل
  if (!user) {
    showToast("Invalid Username or Password!", "error");
    return;
  }

  // نجاح تسجيل الدخول
  sessionStorage.setItem("currentUser", JSON.stringify(user));

  showToast("Login Successful", "success");

  // تحويل حسب الدور
  setTimeout(() => {
    if (user.role === "admin") {
      window.location.href = "dashboard.html";
    } else {
      window.location.href = "pos.html";
    }
  }, 1000);
});