// Toggle password visibility
function togglePassword() {
  const password = document.getElementById("password");
  password.type = password.type === "password" ? "text" : "password";
}

/* ================= REGISTER ================= */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = { name, email, password };

    localStorage.setItem("user", JSON.stringify(user));

    alert("Registration successful!");
    window.location.href = "login.html";
  });
}

/* ================= LOGIN ================= */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("No account found. Please register.");
      return;
    }

    if (email === user.email && password === user.password) {
      alert("Login successful!");
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid credentials");
    }
  });
}