function formatMoney(value) {
    const num = parseFloat(value) || 0;
    return num.toFixed(2) + " EGP";
}



//2//
function getTodayDate() {
  return new Date().toLocaleString("en-GB"); // DD/MM/YYYY, HH:MM:SS
}


// //3//

function showToast(msg, type = "success") {
    let toast = document.getElementById("toast-box");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast-box";
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    // اعاده ضبط الكلاسات
    toast.className = "toast " + type;        // success أو error أو info ...
    toast.textContent = msg;

    // إظهار (غالباً عن طريق كلاس show)
    toast.classList.add("show");

    // إخفاء بعد 3 ثواني
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


// //4//
function convertImageToBase64(file, callback) {
    if (!file) {
        callback(null);
        return;
    }

    const reader = new FileReader();

    reader.onload = function () {
        callback(reader.result);
    };

    reader.onerror = function () {
        callback(null);
    };

    reader.readAsDataURL(file);
}