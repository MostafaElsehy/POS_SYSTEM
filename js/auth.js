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

// ======================
// Handle Register (temporary demo)
// ======================
function handleRegister() {
    const username = document.getElementById('reg-username').value.trim();
    const role = document.getElementById('user-role').value;

    if (!username) {
        alert("Please enter a username");
        return;
    }

    alert(`Account created successfully as ${role} (demo, not saved)`);
    
    // Go back to Login form
    toggleAuth();
}

// ======================
// Handle Login (temporary demo)
// ======================
function handleLogin() {
    const username = document.getElementById('login-username').value.trim();

    if (!username) {
        alert("Please enter a username");
        return;
    }

    alert(`Welcome ${username} (demo login, no password checked)`);
}
