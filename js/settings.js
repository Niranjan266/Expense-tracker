// ================= SETTINGS PAGE JAVASCRIPT =================

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

// ================= INITIALIZATION =================
function initializeSettings() {
  loadUserProfile();
  loadThemeSettings();
  loadCurrencySettings();
  loadNotificationSettings();
  updateStorageInfo();
  setCurrentMonth();
}

// ================= PROFILE SETTINGS =================
function loadUserProfile() {
  const userData = JSON.parse(localStorage.getItem("userData")) || {
    name: "User",
    email: "user@expensetracker.com",
    joinDate: new Date().toISOString()
  };

  document.getElementById("userName").value = userData.name || "";
  document.getElementById("userEmail").value = userData.email || "";

  const joinDate = new Date(userData.joinDate);
  const formattedDate = joinDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  document.getElementById("memberSince").textContent = formattedDate;
}

function saveName() {
  const name = document.getElementById("userName").value.trim();
  if (!name) {
    showToast("❌ Please enter a name");
    return;
  }

  let userData = JSON.parse(localStorage.getItem("userData")) || {};
  userData.name = name;
  localStorage.setItem("userData", JSON.stringify(userData));

  showToast("✅ Name saved successfully!");
}

function saveEmail() {
  const email = document.getElementById("userEmail").value.trim();
  
  if (!email) {
    showToast("❌ Please enter an email");
    return;
  }

  if (!isValidEmail(email)) {
    showToast("❌ Please enter a valid email");
    return;
  }

  let userData = JSON.parse(localStorage.getItem("userData")) || {};
  userData.email = email;
  localStorage.setItem("userData", JSON.stringify(userData));

  showToast("✅ Email saved successfully!");
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ================= THEME SETTINGS =================
function loadThemeSettings() {
  const theme = localStorage.getItem("appTheme") || "dark";
  setTheme(theme);
}

function setTheme(theme) {
  localStorage.setItem("appTheme", theme);

  // Update button states
  const darkBtn = document.getElementById("darkModeBtn");
  const lightBtn = document.getElementById("lightModeBtn");

  if (theme === "dark") {
    darkBtn.classList.add("active");
    lightBtn.classList.remove("active");
    document.body.style.background = "radial-gradient(circle at top left, #1e3a8a, #020617)";
    document.body.style.color = "#e2e8f0";
  } else {
    lightBtn.classList.add("active");
    darkBtn.classList.remove("active");
    document.body.style.background = "#f8fafc";
    document.body.style.color = "#1e293b";
  }

  // Apply theme to all pages
  applyThemeGlobally(theme);

  showToast(`✅ Theme changed to ${theme === 'dark' ? 'Dark' : 'Light'} Mode!`);
}

function applyThemeGlobally(theme) {
  // This will be called when switching to other pages
  // The theme preference is stored and will be applied on page load
}

// ================= CURRENCY SETTINGS =================
function loadCurrencySettings() {
  const currency = JSON.parse(localStorage.getItem("currencySettings")) || {
    code: "INR",
    symbol: "₹"
  };

  updateCurrencyButton(currency.code);
  document.getElementById("currentCurrency").textContent = `${currency.symbol} ${currency.code}`;
}

function changeCurrency(code, symbol) {
  const currencyData = { code, symbol };
  localStorage.setItem("currencySettings", JSON.stringify(currencyData));

  updateCurrencyButton(code);
  document.getElementById("currentCurrency").textContent = `${symbol} ${code}`;

  showToast(`✅ Currency changed to ${symbol} ${code}!`);
}

function updateCurrencyButton(code) {
  const buttons = document.querySelectorAll(".currency-btn");
  buttons.forEach(btn => btn.classList.remove("active"));

  const activeBtn = document.getElementById(`currency${code}`);
  if (activeBtn) {
    activeBtn.classList.add("active");
  }
}

// ================= NOTIFICATIONS SETTINGS =================
function loadNotificationSettings() {
  const notifications = JSON.parse(localStorage.getItem("notificationSettings")) || {
    budgetAlerts: true,
    transactionAlerts: true,
    reportReminder: false
  };

  document.getElementById("budgetAlerts").checked = notifications.budgetAlerts;
  document.getElementById("transactionAlerts").checked = notifications.transactionAlerts;
  document.getElementById("reportReminder").checked = notifications.reportReminder;
}

function toggleBudgetAlerts() {
  updateNotificationSetting("budgetAlerts");
}

function toggleTransactionAlerts() {
  updateNotificationSetting("transactionAlerts");
}

function toggleReportReminder() {
  updateNotificationSetting("reportReminder");
}

function updateNotificationSetting(setting) {
  const notifications = JSON.parse(localStorage.getItem("notificationSettings")) || {};
  const element = document.getElementById(setting.charAt(0).toLowerCase() + setting.slice(1));
  
  notifications[setting] = element.checked;
  localStorage.setItem("notificationSettings", JSON.stringify(notifications));

  showToast(`✅ ${setting.replace(/([A-Z])/g, ' $1').trim()} updated!`);
}

// ================= DATA EXPORT =================
function exportData() {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const budgetData = JSON.parse(localStorage.getItem("budgetData")) || {};
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  const exportData = {
    exportDate: new Date().toISOString(),
    version: "1.0.0",
    userData,
    transactions,
    budgetData,
    totalTransactions: transactions.length,
    totalBudgets: Object.keys(budgetData).length
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `expense-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();

  URL.revokeObjectURL(url);

  showToast("✅ Data exported successfully!");
}

// ================= DATA IMPORT =================
function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);

      if (importedData.userData) {
        localStorage.setItem("userData", JSON.stringify(importedData.userData));
      }

      if (importedData.transactions) {
        localStorage.setItem("transactions", JSON.stringify(importedData.transactions));
      }

      if (importedData.budgetData) {
        localStorage.setItem("budgetData", JSON.stringify(importedData.budgetData));
      }

      document.getElementById("importFile").value = "";
      showToast("✅ Data imported successfully! Refreshing page...");

      setTimeout(() => {
        location.reload();
      }, 1500);
    } catch (error) {
      showToast("❌ Invalid file format. Please import a valid JSON file.");
      document.getElementById("importFile").value = "";
    }
  };

  reader.readAsText(file);
}

// ================= DATA RESET =================
function resetAllData() {
  document.getElementById("resetModal").style.display = "flex";
}

function confirmReset() {
  // Clear all localStorage data
  localStorage.removeItem("transactions");
  localStorage.removeItem("budgetData");
  localStorage.removeItem("userData");

  // Keep only settings
  const appTheme = localStorage.getItem("appTheme");
  const currencySettings = localStorage.getItem("currencySettings");

  localStorage.clear();

  if (appTheme) localStorage.setItem("appTheme", appTheme);
  if (currencySettings) localStorage.setItem("currencySettings", currencySettings);

  closeResetModal();
  showToast("✅ All data has been reset!");

  setTimeout(() => {
    location.reload();
  }, 1500);
}

function closeResetModal() {
  document.getElementById("resetModal").style.display = "none";
}

// Close modal when clicking outside
window.addEventListener("click", function(e) {
  const resetModal = document.getElementById("resetModal");
  if (e.target === resetModal) {
    closeResetModal();
  }
});

// ================= STORAGE INFORMATION =================
function updateStorageInfo() {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  document.getElementById("transactionCount").textContent = transactions.length;

  // Calculate storage used
  let totalSize = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      totalSize += localStorage[key].length + key.length;
    }
  }

  const kb = (totalSize / 1024).toFixed(2);
  document.getElementById("storageUsed").textContent = `${kb} KB`;

  // Last backup
  const lastBackupTime = localStorage.getItem("lastBackupTime");
  if (lastBackupTime) {
    const backupDate = new Date(lastBackupTime);
    document.getElementById("lastBackup").textContent = backupDate.toLocaleDateString('en-IN');
  } else {
    document.getElementById("lastBackup").textContent = "Never";
  }
}

// ================= TOAST NOTIFICATION =================
function showToast(message) {
  const toast = document.getElementById("successToast");
  const toastMessage = document.getElementById("toastMessage");

  toastMessage.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ================= UTILITIES =================
function setCurrentMonth() {
  const today = new Date();
  const monthName = today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

// ================= PAGE INITIALIZATION =================
document.addEventListener("DOMContentLoaded", function() {
  initializeSettings();

  // Apply saved theme
  const savedTheme = localStorage.getItem("appTheme") || "dark";
  if (savedTheme === "light") {
    // Light mode needs special styling
    document.body.classList.add("light-mode");
  }
});

// ================= KEYBOARD SHORTCUTS =================
document.addEventListener("keydown", function(e) {
  // Ctrl/Cmd + S to save profile
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveName();
  }
});
