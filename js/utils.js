export function formatMoney(amount) {
  return parseFloat(amount).toFixed(2) + " EGP";
}

export function getTodayDate() {
  return new Date().toLocaleString("en-GB"); // DD/MM/YYYY, HH:MM:SS
}

export function showToast(msg, type = "success") {
  let toast = document.getElementById("toast-box");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-box";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = `toast show ${type === "error" ? "error" : ""}`;
  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}

export function convertImageToBase64(file, callback) {
  const reader = new FileReader();
  reader.onloadend = () => callback(reader.result);
  reader.readAsDataURL(file);
}
