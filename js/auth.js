// Toggle password visibility
function togglePassword() {
  const password = document.getElementById("password");
  password.type = password.type === "password" ? "text" : "password";
}

// ================= THEME INITIALIZATION =================
function initializeTheme() {
  const savedTheme = localStorage.getItem("appTheme") || "light";
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark-mode");
  } else {
    document.documentElement.classList.add("light-mode");
  }

  // Apply saved accent color
  const savedAccentColor = localStorage.getItem("accentColor") || "blue";
  applyAccentColorOnInit(savedAccentColor);
}

function applyAccentColorOnInit(color) {
  // Color mappings
  const colors = {
    blue: {
      primary: "#3b82f6",
      primaryLight: "#60a5fa",
      primaryDark: "#2563eb",
      primarySubtle: "rgba(59, 130, 246, 0.15)",
      gradientPrimary: "linear-gradient(135deg, #3b82f6, #60a5fa)",
      shadowGlow: "rgba(59, 130, 246, 0.15)"
    },
    violet: {
      primary: "#8b5cf6",
      primaryLight: "#a78bfa",
      primaryDark: "#7c3aed",
      primarySubtle: "rgba(139, 92, 246, 0.15)",
      gradientPrimary: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
      shadowGlow: "rgba(139, 92, 246, 0.15)"
    },
    emerald: {
      primary: "#10b981",
      primaryLight: "#34d399",
      primaryDark: "#059669",
      primarySubtle: "rgba(16, 185, 129, 0.15)",
      gradientPrimary: "linear-gradient(135deg, #10b981, #34d399)",
      shadowGlow: "rgba(16, 185, 129, 0.15)"
    },
    amber: {
      primary: "#f59e0b",
      primaryLight: "#fbbf24",
      primaryDark: "#d97706",
      primarySubtle: "rgba(245, 158, 11, 0.15)",
      gradientPrimary: "linear-gradient(135deg, #f59e0b, #fbbf24)",
      shadowGlow: "rgba(245, 158, 11, 0.15)"
    },
    rose: {
      primary: "#f43f5e",
      primaryLight: "#fb7185",
      primaryDark: "#e11d48",
      primarySubtle: "rgba(244, 63, 94, 0.15)",
      gradientPrimary: "linear-gradient(135deg, #f43f5e, #fb7185)",
      shadowGlow: "rgba(244, 63, 94, 0.15)"
    }
  };

  const selected = colors[color] || colors.blue;
  const root = document.documentElement;

  root.style.setProperty("--primary", selected.primary);
  root.style.setProperty("--primary-light", selected.primaryLight);
  root.style.setProperty("--primary-dark", selected.primaryDark);
  root.style.setProperty("--primary-subtle", selected.primarySubtle);
  root.style.setProperty("--gradient-primary", selected.gradientPrimary);
  root.style.setProperty("--shadow-glow", selected.shadowGlow);
  root.style.setProperty("--border-focus", selected.primary);
}

// Apply theme on page load
document.addEventListener("DOMContentLoaded", initializeTheme);

/* ================= DEMO ACCOUNT ================= */
// Demo credentials
const DEMO_EMAIL = "demo@expensetracker.com";
const DEMO_PASSWORD = "demo123";

// Demo data to populate the app
function setupDemoData() {
  const demoUser = {
    name: "Demo User",
    email: DEMO_EMAIL,
    joinDate: new Date().toISOString()
  };
  localStorage.setItem("userData", JSON.stringify(demoUser));

  // Demo transactions
  const demoTransactions = [
    { id: 1, type: "income", amount: 50000, category: "Salary", date: "2024-01-01", note: "Monthly salary" },
    { id: 2, type: "expense", amount: 500, category: "Food", date: "2024-01-05", note: "Grocery shopping" },
    { id: 3, type: "expense", amount: 15000, category: "Rent", date: "2024-01-10", note: "Monthly rent" },
    { id: 4, type: "expense", amount: 2000, category: "Transport", date: "2024-01-15", note: "Fuel and commute" },
    { id: 5, type: "expense", amount: 800, category: "Food", date: "2024-01-20", note: "Restaurant" },
    { id: 6, type: "expense", amount: 300, category: "Entertainment", date: "2024-01-25", note: "Movie tickets" },
    { id: 7, type: "income", amount: 5000, category: "Other", date: "2024-02-01", note: "Freelance work" },
    { id: 8, type: "expense", amount: 2500, category: "Shopping", date: "2024-02-05", note: "Clothes" },
    { id: 9, type: "expense", amount: 1200, category: "Utilities", date: "2024-02-10", note: "Electricity bill" },
    { id: 10, type: "expense", amount: 600, category: "Food", date: "2024-02-15", note: "Grocery" }
  ];
  localStorage.setItem("transactions", JSON.stringify(demoTransactions));

  // Demo budgets
  const demoBudgets = [
    { category: "Food", limit: 10000, spent: 7300 },
    { category: "Rent", limit: 15000, spent: 15000 },
    { category: "Transport", limit: 5000, spent: 2000 },
    { category: "Entertainment", limit: 3000, spent: 300 },
    { category: "Shopping", limit: 5000, spent: 2500 },
    { category: "Utilities", limit: 3000, spent: 1200 }
  ];
  localStorage.setItem("budgetData", JSON.stringify(demoBudgets));

  // Set demo as logged in
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("currentUser", DEMO_EMAIL);
}

// Demo login handler
function handleDemoLogin() {
  // Set up demo data
  setupDemoData();

  // Show success message and redirect
  const messageEl = document.getElementById("authMessage");
  if (messageEl) {
    messageEl.textContent = "Logging in with demo account...";
    messageEl.className = "form-message visible success";
  }

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 500);
}

// Demo button event listener
document.addEventListener("DOMContentLoaded", function() {
  const demoBtn = document.getElementById("demoLoginBtn");
  if (demoBtn) {
    demoBtn.addEventListener("click", handleDemoLogin);
  }
});

/* ================= REGISTER ================= */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Store user credentials
    const user = { name, email, password };
    localStorage.setItem("user", JSON.stringify(user));

    // Also store as userData for settings
    const userData = {
      name: name,
      email: email,
      joinDate: new Date().toISOString()
    };
    localStorage.setItem("userData", JSON.stringify(userData));

    // Set logged in
    localStorage.setItem("isLoggedIn", "true");

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
      // Store user data for settings
      const userData = {
        name: user.name,
        email: user.email,
        joinDate: new Date().toISOString()
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("isLoggedIn", "true");

      alert("Login successful!");
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid credentials");
    }
  });
}