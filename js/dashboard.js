let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
const modal = document.getElementById("modal");
const addBtn = document.querySelector(".add-btn");
const form = document.getElementById("transactionForm");

// ================= SIDEBAR NAVIGATION =================
const sidebarItems = document.querySelectorAll(".sidebar li");

sidebarItems.forEach(item => {
  item.addEventListener("click", function() {
    // Remove active class from all items
    sidebarItems.forEach(li => li.classList.remove("active"));
    // Add active class to clicked item
    this.classList.add("active");
    
    // Navigate to pages
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

// ================= ADD TRANSACTION =================

// Open modal
addBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  console.log("Modal opened");
});

// Close modal
function closeModal() {
  modal.style.display = "none";
}

// Close modal when clicking outside
window.addEventListener("click", function(e) {
  if (e.target === modal) {
    closeModal();
  }
});

// Add transaction
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;
  const type = document.getElementById("type").value;
  const description = document.getElementById("description").value;

  // Validation
  if (!amount || !date) {
    alert("Please fill in all required fields!");
    return;
  }

  const transaction = {
    id: Date.now(),
    amount: Number(amount),
    category,
    date,
    type,
    description
  };

  transactions.push(transaction);

  localStorage.setItem("transactions", JSON.stringify(transactions));
  
  // Trigger storage event for other pages
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'transactions',
    newValue: JSON.stringify(transactions)
  }));

  closeModal();
  loadDashboard();
  form.reset();
  alert("Transaction added successfully!");
});

// Existing functions
const transactionList = document.getElementById("transactionList");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");
const savingsEl = document.getElementById("savings");

function loadDashboard() {
  updateCards();
  showTransactions();
  initializeCharts();
}

function updateCards() {
  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  const balance = income - expense;
  const savings = balance * 0.2;

  incomeEl.textContent = "₹" + income;
  expenseEl.textContent = "₹" + expense;
  balanceEl.textContent = "₹" + balance;
  savingsEl.textContent = "₹" + savings.toFixed(0);
}

function showTransactions() {
  transactionList.innerHTML = "";

  if (transactions.length === 0) {
    transactionList.innerHTML = `<tr><td colspan="5">No transactions</td></tr>`;
    return;
  }

  transactions.slice().reverse().forEach(t => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${t.date}</td>
      <td>${t.category}</td>
      <td>${t.description}</td>
      <td>₹${t.amount}</td>
      <td>${t.type}</td>
    `;

    transactionList.appendChild(row);
  });
}

// Chart variables
let lineChart, pieChart, barChart;

// Initialize and update charts
function initializeCharts() {
  const ctx1 = document.getElementById("chart").getContext("2d");
  const ctx2 = document.getElementById("pieChart").getContext("2d");
  const ctx3 = document.getElementById("barChart").getContext("2d");

  // Calculate data
  let income = 0;
  let expense = 0;
  const categoryExpense = {};

  transactions.forEach(t => {
    if (t.type === "income") {
      income += t.amount;
    } else {
      expense += t.amount;
      categoryExpense[t.category] = (categoryExpense[t.category] || 0) + t.amount;
    }
  });

  // Destroy existing charts
  if (lineChart) lineChart.destroy();
  if (pieChart) pieChart.destroy();
  if (barChart) barChart.destroy();

  // Line Chart - Monthly Overview
  lineChart = new Chart(ctx1, {
    type: "line",
    data: {
      labels: Object.keys(categoryExpense).length > 0 ? Object.keys(categoryExpense) : ["No Data"],
      datasets: [{
        label: "Monthly Transactions",
        data: Object.values(categoryExpense).length > 0 ? Object.values(categoryExpense) : [0],
        borderColor: "#60a5fa",
        backgroundColor: "rgba(96, 165, 250, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#60a5fa",
        pointBorderColor: "#ffffff"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            color: "#e2e8f0"
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: "#93c5fd" },
          grid: { color: "rgba(255,255,255,0.1)" }
        },
        x: {
          ticks: { color: "#93c5fd" },
          grid: { color: "rgba(255,255,255,0.1)" }
        }
      }
    }
  });

  // Pie Chart - Expenses by Category
  pieChart = new Chart(ctx2, {
    type: "doughnut",
    data: {
      labels: Object.keys(categoryExpense).length > 0 ? Object.keys(categoryExpense) : ["No Data"],
      datasets: [{
        data: Object.values(categoryExpense).length > 0 ? Object.values(categoryExpense) : [1],
        backgroundColor: [
          "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"
        ],
        borderColor: "rgba(30, 41, 59, 0.6)",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            color: "#e2e8f0",
            padding: 15
          }
        }
      }
    }
  });

  // Bar Chart - Income vs Expenses
  barChart = new Chart(ctx3, {
    type: "bar",
    data: {
      labels: ["Income", "Expense", "Balance"],
      datasets: [{
        label: "Amount (₹)",
        data: [income, expense, income - expense],
        backgroundColor: [
          "#22c55e",
          "#ef4444",
          "#3b82f6"
        ],
        borderColor: [
          "#16a34a",
          "#dc2626",
          "#1d4ed8"
        ],
        borderWidth: 1,
        borderRadius: 10
      }]
    },
    options: {
      indexAxis: "x",
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            color: "#e2e8f0"
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: "#93c5fd" },
          grid: { color: "rgba(255,255,255,0.1)" }
        },
        x: {
          ticks: { color: "#93c5fd" },
          grid: { color: "rgba(255,255,255,0.1)" }
        }
      }
    }
  });
}

loadDashboard();
initializeCharts();