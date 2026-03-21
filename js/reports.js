let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let lineChart, pieChart, barChart;

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

// ================= REPORT GENERATION =================
const downloadBtn = document.getElementById("downloadBtn");

downloadBtn.addEventListener("click", downloadReportAsPDF);

function downloadReportAsPDF() {
  const element = document.getElementById("reportContent");
  const opt = {
    margin: 10,
    filename: `expense-tracker-report-${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  };

  html2pdf().set(opt).from(element).save();
}

// ================= LOAD DASHBOARD =================
function loadDashboard() {
  updateCards();
  updateCategoryBreakdown();
  updateMonthlySummary();
  initializeCharts();
}

function updateCards() {
  const incomeEl = document.getElementById("income");
  const expenseEl = document.getElementById("expense");
  const balanceEl = document.getElementById("balance");
  const savingsEl = document.getElementById("savings");

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

function updateCategoryBreakdown() {
  const categoryList = document.getElementById("categoryList");
  const categoryData = {};
  let totalExpense = 0;

  transactions.forEach(t => {
    if (t.type === "expense") {
      totalExpense += t.amount;
      if (!categoryData[t.category]) {
        categoryData[t.category] = { amount: 0, count: 0 };
      }
      categoryData[t.category].amount += t.amount;
      categoryData[t.category].count += 1;
    }
  });

  categoryList.innerHTML = "";

  if (Object.keys(categoryData).length === 0) {
    categoryList.innerHTML = `<tr><td colspan="4">No expense data available</td></tr>`;
    return;
  }

  Object.keys(categoryData).forEach(category => {
    const data = categoryData[category];
    const percentage = ((data.amount / totalExpense) * 100).toFixed(1);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${category}</td>
      <td>₹${data.amount.toFixed(2)}</td>
      <td>${percentage}%</td>
      <td>${data.count}</td>
    `;
    categoryList.appendChild(row);
  });
}

function updateMonthlySummary() {
  const monthlySummary = document.getElementById("monthlySummary");
  const monthlyData = {};

  transactions.forEach(t => {
    const dateObj = new Date(t.date);
    const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }

    if (t.type === "income") {
      monthlyData[monthKey].income += t.amount;
    } else {
      monthlyData[monthKey].expense += t.amount;
    }
  });

  monthlySummary.innerHTML = "";

  if (Object.keys(monthlyData).length === 0) {
    monthlySummary.innerHTML = `<tr><td colspan="4">No monthly data available</td></tr>`;
    return;
  }

  Object.keys(monthlyData).sort().reverse().forEach(month => {
    const data = monthlyData[month];
    const balance = data.income - data.expense;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${month}</td>
      <td>₹${data.income.toFixed(2)}</td>
      <td>₹${data.expense.toFixed(2)}</td>
      <td>₹${balance.toFixed(2)}</td>
    `;
    monthlySummary.appendChild(row);
  });
}

// ================= CHARTS =================
function initializeCharts() {
  const ctx1 = document.getElementById("chart").getContext("2d");
  const ctx2 = document.getElementById("pieChart").getContext("2d");
  const ctx3 = document.getElementById("barChart").getContext("2d");

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

  // Line Chart
  lineChart = new Chart(ctx1, {
    type: "line",
    data: {
      labels: Object.keys(categoryExpense).length > 0 ? Object.keys(categoryExpense) : ["No Data"],
      datasets: [{
        label: "Expenses by Category",
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
          labels: { color: "#e2e8f0" }
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

  // Pie Chart
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

  // Bar Chart
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
          labels: { color: "#e2e8f0" }
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

// Initialize
loadDashboard();
