// ======================
// Switch between Login & Register forms
// ======================
function toggleAuth() {
    const loginCard = document.getElementById('login-card');
    const registerCard = document.getElementById('register-card');

    if (loginCard.style.display === "none") {
        loginCard.style.display = "block";
        registerCard.style.display = "none";
    } else {
        loginCard.style.display = "none";
        registerCard.style.display = "block";
    }
}


