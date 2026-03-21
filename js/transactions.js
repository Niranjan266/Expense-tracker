let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
const modal = document.getElementById("modal");
const addBtn = document.querySelector(".add-btn");
const form = document.getElementById("transactionForm");

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

// ================= ADD TRANSACTION =================

// Open modal
addBtn.addEventListener("click", () => {
  modal.style.display = "flex";
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
  loadPage();
  form.reset();
  alert("Transaction added successfully!");
});

// ================= PAGE FUNCTIONS =================
const transactionList = document.getElementById("transactionList");

function loadPage() {
  showTransactions();
}

function showTransactions() {
  transactionList.innerHTML = "";

  if (transactions.length === 0) {
    transactionList.innerHTML = `<tr><td colspan="6">No transactions yet</td></tr>`;
    return;
  }

  transactions.slice().reverse().forEach(t => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${t.date}</td>
      <td>${t.category}</td>
      <td>${t.description}</td>
      <td>₹${t.amount}</td>
      <td><span class="badge ${t.type}">${t.type}</span></td>
      <td><button class="delete-btn" onclick="deleteTransaction(${t.id})">🗑️</button></td>
    `;
    transactionList.appendChild(row);
  });
}

function deleteTransaction(id) {
  if (confirm("Are you sure you want to delete this transaction?")) {
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    
    // Trigger storage event for other pages
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'transactions',
      newValue: JSON.stringify(transactions)
    }));
    
    loadPage();
  }
}

// ================= FILTERS =================
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");
const filterCategory = document.getElementById("filterCategory");
const clearFilters = document.getElementById("clearFilters");

searchInput.addEventListener("input", filterTransactions);
filterType.addEventListener("change", filterTransactions);
filterCategory.addEventListener("change", filterTransactions);

clearFilters.addEventListener("click", () => {
  searchInput.value = "";
  filterType.value = "";
  filterCategory.value = "";
  loadPage();
});

function filterTransactions() {
  const search = searchInput.value.toLowerCase();
  const type = filterType.value;
  const category = filterCategory.value;

  transactionList.innerHTML = "";

  const filtered = transactions.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(search);
    const matchType = type === "" || t.type === type;
    const matchCategory = category === "" || t.category === category;
    return matchSearch && matchType && matchCategory;
  });

  if (filtered.length === 0) {
    transactionList.innerHTML = `<tr><td colspan="6">No transactions found</td></tr>`;
    return;
  }

  filtered.slice().reverse().forEach(t => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${t.date}</td>
      <td>${t.category}</td>
      <td>${t.description}</td>
      <td>₹${t.amount}</td>
      <td><span class="badge ${t.type}">${t.type}</span></td>
      <td><button class="delete-btn" onclick="deleteTransaction(${t.id})">🗑️</button></td>
    `;
    transactionList.appendChild(row);
  });
}

// Initialize
loadPage();
