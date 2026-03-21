// Toggle password visibility
function togglePassword() {
  const password = document.getElementById("password");
  password.type = password.type === "password" ? "text" : "password";
}

// Register logic
document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Basic validation
  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  // Check if user already exists
  const existingUser = JSON.parse(localStorage.getItem("user"));

  if (existingUser && existingUser.email === email) {
    alert("User already exists. Please login.");
    return;
  }

  const user = { name, email, password };

  localStorage.setItem("user", JSON.stringify(user));

  alert("Registration successful!");
  window.location.href = "login.html";
});