let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let budgetData = JSON.parse(localStorage.getItem("budgetData")) || {};

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

// ================= SIDEBAR NAVIGATION =================
const sidebarItems = document.querySelectorAll(".sidebar li");

sidebarItems.forEach(item => {
  item.addEventListener("click", function() {
    const text = this.textContent.trim();
    
    if (text.includes("Dashboard")) {
      window.location.href = "dashboard.html";
    } else if (text.includes("Transactions")) {
      window.location.href = "transactions.html";
    } else if (text.includes("Budgets")) {
      window.location.href = "budgets.html";
    } else if (text.includes("Reports")) {
      window.location.href = "reports.html";
    } else if (text.includes("Settings")) {
      window.location.href = "settings.html";
    }
  });
});

// ================= BUDGET MODAL FUNCTIONS =================
const budgetModal = document.getElementById("budgetModal");
const budgetForm = document.getElementById("budgetForm");

function openBudgetModal() {
  budgetModal.style.display = "flex";
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  document.getElementById("monthInput").value = `${year}-${month}`;
  
  const currentKey = `${year}-${month}`;
  if (budgetData[currentKey]) {
    document.getElementById("budgetInput").value = budgetData[currentKey].amount;
    document.getElementById("foodBudget").value = budgetData[currentKey].categoryBudgets?.Food || "";
    document.getElementById("transportBudget").value = budgetData[currentKey].categoryBudgets?.Transport || "";
    document.getElementById("rentBudget").value = budgetData[currentKey].categoryBudgets?.Rent || "";
    document.getElementById("shoppingBudget").value = budgetData[currentKey].categoryBudgets?.Shopping || "";
    document.getElementById("billsBudget").value = budgetData[currentKey].categoryBudgets?.Bills || "";
  }
}

function closeBudgetModal() {
  budgetModal.style.display = "none";
}

window.addEventListener("click", function(e) {
  if (e.target === budgetModal) {
    closeBudgetModal();
  }
});

// ================= BUDGET FORM SUBMISSION =================
budgetForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const monthInput = document.getElementById("monthInput").value;
  const budgetAmount = Number(document.getElementById("budgetInput").value);

  if (!monthInput || !budgetAmount) {
    alert("Please fill in all required fields!");
    return;
  }

  const categoryBudgets = {
    Food: Number(document.getElementById("foodBudget").value) || 0,
    Transport: Number(document.getElementById("transportBudget").value) || 0,
    Rent: Number(document.getElementById("rentBudget").value) || 0,
    Shopping: Number(document.getElementById("shoppingBudget").value) || 0,
    Bills: Number(document.getElementById("billsBudget").value) || 0
  };

  budgetData[monthInput] = {
    amount: budgetAmount,
    categoryBudgets: categoryBudgets,
    createdDate: new Date().toISOString()
  };

  localStorage.setItem("budgetData", JSON.stringify(budgetData));

  closeBudgetModal();
  loadBudgetPage();
  alert("Budget saved successfully!");
});

// ================= LOAD BUDGET PAGE =================
function loadBudgetPage() {
  updateCurrentBudget();
  updateCategoryBudgets();
  updateSpendingSummary();
  updateBudgetHistory();
}

// ================= UPDATE CURRENT BUDGET =================
function updateCurrentBudget() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const monthKey = `${year}-${month}`;

  document.getElementById("currentMonth").textContent = 
    new Date(year, today.getMonth()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const budget = budgetData[monthKey];
  
  if (!budget) {
    document.getElementById("budgetAmount").textContent = "₹0";
    document.getElementById("totalSpent").textContent = "₹0";
    document.getElementById("remaining").textContent = "₹0";
    document.getElementById("percentageLabel").textContent = "0%";
    document.getElementById("progressFill").style.width = "0%";
    document.getElementById("warningMessage").innerHTML = "";
    return;
  }

  // Calculate total expenses for current month
  const totalSpent = calculateMonthlyExpenses(monthKey);
  const remaining = budget.amount - totalSpent;
  const percentage = (totalSpent / budget.amount) * 100;

  // Update display
  document.getElementById("budgetAmount").textContent = "₹" + budget.amount.toLocaleString('en-IN');
  document.getElementById("totalSpent").textContent = "₹" + totalSpent.toLocaleString('en-IN');
  document.getElementById("remaining").textContent = "₹" + remaining.toLocaleString('en-IN');
  document.getElementById("percentageLabel").textContent = Math.min(Math.round(percentage), 100) + "%";

  // Update progress bar
  const progressFill = document.getElementById("progressFill");
  progressFill.style.width = Math.min(percentage, 100) + "%";

  // Change progress bar color
  progressFill.classList.remove("safe", "warning", "danger");
  if (percentage <= 70) {
    progressFill.classList.add("safe");
  } else if (percentage <= 100) {
    progressFill.classList.add("warning");
  } else {
    progressFill.classList.add("danger");
  }

  // Update warning message
  const warningMsg = document.getElementById("warningMessage");
  warningMsg.classList.remove("show", "warning", "danger");

  if (percentage >= 100) {
    warningMsg.innerHTML = "⚠️ You have exceeded your budget!";
    warningMsg.classList.add("show", "danger");
    document.getElementById("remaining").style.color = "#ef4444";
  } else if (percentage > 70) {
    warningMsg.innerHTML = "⚠️ You are nearing your budget limit";
    warningMsg.classList.add("show", "warning");
    document.getElementById("remaining").style.color = "#f97316";
  } else {
    document.getElementById("remaining").style.color = "#22c55e";
  }
}

// ================= CALCULATE MONTHLY EXPENSES =================
function calculateMonthlyExpenses(monthKey) {
  let total = 0;
  const [year, month] = monthKey.split('-');

  transactions.forEach(t => {
    if (t.type === "expense") {
      const tDate = new Date(t.date);
      const tYear = tDate.getFullYear();
      const tMonth = String(tDate.getMonth() + 1).padStart(2, '0');
      
      if (`${tYear}-${tMonth}` === monthKey) {
        total += t.amount;
      }
    }
  });

  return total;
}

// ================= CALCULATE CATEGORY EXPENSES =================
function calculateCategoryExpenses(monthKey, category) {
  let total = 0;

  transactions.forEach(t => {
    if (t.type === "expense" && t.category === category) {
      const tDate = new Date(t.date);
      const tYear = tDate.getFullYear();
      const tMonth = String(tDate.getMonth() + 1).padStart(2, '0');
      
      if (`${tYear}-${tMonth}` === monthKey) {
        total += t.amount;
      }
    }
  });

  return total;
}

// ================= UPDATE CATEGORY BUDGETS =================
function updateCategoryBudgets() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const monthKey = `${year}-${month}`;

  const budget = budgetData[monthKey];
  
  if (!budget) {
    document.getElementById("categoryGrid").innerHTML = "<p style='color: #64748b; padding: 20px;'>No budget set for this month</p>";
    return;
  }

  const categoryBudgets = budget.categoryBudgets || {};
  let html = "";

  Object.keys(categoryBudgets).forEach(category => {
    const budgetAmount = categoryBudgets[category];
    if (budgetAmount > 0) {
      const spent = calculateCategoryExpenses(monthKey, category);
      const remaining = budgetAmount - spent;
      const percentage = (spent / budgetAmount) * 100;

      html += `
        <div class="category-card">
          <h3>📌 ${category}</h3>
          <p class="amount">₹${spent.toLocaleString('en-IN')}</p>
          <p class="max-amount">of ₹${budgetAmount.toLocaleString('en-IN')}</p>
          <div class="small-progress">
            <div class="progress-fill ${getPybarClass(percentage)}" style="width: ${Math.min(percentage, 100)}%"></div>
          </div>
          <span>${Math.round(percentage)}%</span>
        </div>
      `;
    }
  });

  document.getElementById("categoryGrid").innerHTML = html || "<p style='color: #64748b; padding: 20px;'>No category budgets set</p>";
}

// ================= UPDATE SPENDING SUMMARY =================
function updateSpendingSummary() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const monthKey = `${year}-${month}`;

  const categories = ["Food", "Transport", "Rent", "Shopping", "Bills"];

  categories.forEach(cat => {
    const spent = calculateCategoryExpenses(monthKey, cat);
    document.getElementById(cat.toLowerCase() + "Spent").textContent = "₹" + spent.toLocaleString('en-IN');

    const budget = budgetData[monthKey]?.categoryBudgets?.[cat] || 0;
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;

    const progressFill = document.getElementById(cat.toLowerCase() + "Progress");
    progressFill.style.width = Math.min(percentage, 100) + "%";
    progressFill.className = "progress-fill " + getPybarClass(percentage);

    document.getElementById(cat.toLowerCase() + "Percent").textContent = Math.round(percentage) + "%";
  });
}

// ================= GET PROGRESS BAR CLASS =================
function getPybarClass(percentage) {
  if (percentage <= 70) return "safe";
  if (percentage <= 100) return "warning";
  return "danger";
}

// ================= UPDATE BUDGET HISTORY =================
function updateBudgetHistory() {
  const historyList = document.getElementById("budgetHistoryList");
  const sortedMonths = Object.keys(budgetData).sort().reverse();

  if (sortedMonths.length === 0) {
    historyList.innerHTML = `<tr><td colspan="5">No budget history</td></tr>`;
    return;
  }

  historyList.innerHTML = "";

  sortedMonths.forEach(monthKey => {
    const budget = budgetData[monthKey];
    const spent = calculateMonthlyExpenses(monthKey);
    const remaining = budget.amount - spent;
    const percentage = (spent / budget.amount) * 100;

    let statusClass = "ok";
    let statusText = "On Track";

    if (percentage >= 100) {
      statusClass = "exceeded";
      statusText = "Exceeded";
    } else if (percentage > 70) {
      statusClass = "warning";
      statusText = "Warning";
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${monthKey}</td>
      <td>₹${budget.amount.toLocaleString('en-IN')}</td>
      <td>₹${spent.toLocaleString('en-IN')}</td>
      <td>₹${remaining.toLocaleString('en-IN')}</td>
      <td><span class="status-badge ${statusClass}">${statusText}</span></td>
    `;

    historyList.appendChild(row);
  });
}

// ================= WATCH FOR TRANSACTION CHANGES =================
window.addEventListener("storage", function(e) {
  if (e.key === "transactions") {
    transactions = JSON.parse(e.newValue) || [];
    loadBudgetPage();
  }
});

// Initialize page
loadBudgetPage();
