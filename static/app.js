const state = {
  categories: [],
  transactions: [],
  filters: { start: "", end: "", category_id: "" },
  editingId: null,
};

const authCard = document.getElementById("authCard");
const appSection = document.getElementById("app");
const userArea = document.getElementById("userArea");
const authMsg = document.getElementById("authMsg");
const appMsg = document.getElementById("appMsg");

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function money(n) {
  return Number(n).toFixed(2);
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "same-origin",
    ...options,
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const data = await res.json();
      message = data.error || message;
    } catch (_) {}
    throw new Error(message);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

function setAuthUI(email) {
  if (email) {
    authCard.classList.add("hidden");
    appSection.classList.remove("hidden");
    userArea.textContent = email;
  } else {
    authCard.classList.remove("hidden");
    appSection.classList.add("hidden");
    userArea.textContent = "";
  }
}

async function loadCategories() {
  const data = await api("/api/categories");
  state.categories = data.categories;

  const txSel = document.getElementById("txCategory");
  const filterSel = document.getElementById("filterCategory");
  txSel.innerHTML = "";
  filterSel.innerHTML = '<option value="">All Categories</option>';

  state.categories.forEach((cat) => {
    const o1 = document.createElement("option");
    o1.value = cat.id;
    o1.textContent = cat.name;
    txSel.appendChild(o1);

    const o2 = document.createElement("option");
    o2.value = cat.id;
    o2.textContent = cat.name;
    filterSel.appendChild(o2);
  });
}

function renderTransactions() {
  const tbody = document.getElementById("txTableBody");
  tbody.innerHTML = "";
  if (!state.transactions.length) {
    tbody.innerHTML = '<tr><td colspan="6">No transactions found.</td></tr>';
    return;
  }

  state.transactions.forEach((tx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${tx.date}</td>
      <td>${tx.type}</td>
      <td>${money(tx.amount)}</td>
      <td>${tx.category_name}</td>
      <td>${tx.note || ""}</td>
      <td>
        <button class="secondary" data-edit="${tx.id}">Edit</button>
        <button class="danger" data-del="${tx.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderCategoryBars(list) {
  const wrap = document.getElementById("categoryBars");
  wrap.innerHTML = "";
  if (!list.length) {
    wrap.textContent = "No expenses for this month.";
    return;
  }
  const max = Math.max(...list.map((x) => Number(x.total)));
  list.forEach((item) => {
    const pct = max > 0 ? (Number(item.total) / max) * 100 : 0;
    const row = document.createElement("div");
    row.className = "barRow";
    row.innerHTML = `
      <span>${item.category}</span>
      <div class="barTrack"><div class="barFill" style="width:${pct.toFixed(2)}%"></div></div>
      <strong>${money(item.total)}</strong>
    `;
    wrap.appendChild(row);
  });
}

async function loadTransactions() {
  const q = new URLSearchParams();
  if (state.filters.start) q.set("start", state.filters.start);
  if (state.filters.end) q.set("end", state.filters.end);
  if (state.filters.category_id) q.set("category_id", state.filters.category_id);
  const data = await api(`/api/transactions?${q.toString()}`);
  state.transactions = data.transactions;
  renderTransactions();
}

async function loadDashboard() {
  const month = currentMonth();
  const data = await api(`/api/dashboard?month=${month}`);
  document.getElementById("incomeVal").textContent = money(data.income);
  document.getElementById("expenseVal").textContent = money(data.expense);
  document.getElementById("netVal").textContent = money(data.net);
  renderCategoryBars(data.by_category || []);
}

async function loadBudget() {
  const month = document.getElementById("budgetMonth").value || currentMonth();
  const data = await api(`/api/budget?month=${month}`);
  document.getElementById("budgetAmount").value = data.amount ? money(data.amount) : "";
  document.getElementById("budgetSummary").textContent =
    `Spent ${money(data.spent)} | Remaining ${money(data.remaining)} | Used ${data.used_pct}%`;
}

function resetTxForm() {
  state.editingId = null;
  document.getElementById("txForm").reset();
  document.getElementById("txDate").value = todayISO();
  document.getElementById("txSubmitBtn").textContent = "Add Transaction";
  document.getElementById("txCancelEdit").classList.add("hidden");
}

async function refreshApp() {
  await loadCategories();
  await Promise.all([loadTransactions(), loadDashboard(), loadBudget()]);
}

async function bootstrap() {
  document.getElementById("txDate").value = todayISO();
  document.getElementById("budgetMonth").value = currentMonth();

  try {
    const me = await api("/api/me");
    if (me.authenticated) {
      setAuthUI(me.email);
      await refreshApp();
    } else {
      setAuthUI(null);
    }
  } catch (err) {
    authMsg.textContent = err.message;
  }
}

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  authMsg.textContent = "";
  try {
    await api("/api/register", {
      method: "POST",
      body: JSON.stringify({
        email: document.getElementById("registerEmail").value,
        password: document.getElementById("registerPassword").value,
      }),
    });
    authMsg.style.color = "#0f766e";
    authMsg.textContent = "Registration successful. Please login.";
  } catch (err) {
    authMsg.style.color = "#b91c1c";
    authMsg.textContent = err.message;
  }
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  authMsg.textContent = "";
  try {
    const data = await api("/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value,
      }),
    });
    setAuthUI(data.email);
    await refreshApp();
  } catch (err) {
    authMsg.textContent = err.message;
  }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await api("/api/logout", { method: "POST" });
  setAuthUI(null);
});

document.getElementById("txForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  appMsg.textContent = "";

  const payload = {
    type: document.getElementById("txType").value,
    amount: Number(document.getElementById("txAmount").value),
    date: document.getElementById("txDate").value,
    category_id: Number(document.getElementById("txCategory").value),
    note: document.getElementById("txNote").value,
  };

  try {
    if (state.editingId) {
      await api(`/api/transactions/${state.editingId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } else {
      await api("/api/transactions", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }
    resetTxForm();
    await Promise.all([loadTransactions(), loadDashboard(), loadBudget()]);
  } catch (err) {
    appMsg.textContent = err.message;
  }
});

document.getElementById("txCancelEdit").addEventListener("click", () => {
  resetTxForm();
});

document.getElementById("txTableBody").addEventListener("click", async (e) => {
  const editId = e.target.getAttribute("data-edit");
  const delId = e.target.getAttribute("data-del");

  if (editId) {
    const tx = state.transactions.find((t) => String(t.id) === String(editId));
    if (!tx) return;
    state.editingId = tx.id;
    document.getElementById("txType").value = tx.type;
    document.getElementById("txAmount").value = tx.amount;
    document.getElementById("txDate").value = tx.date;
    document.getElementById("txCategory").value = tx.category_id;
    document.getElementById("txNote").value = tx.note || "";
    document.getElementById("txSubmitBtn").textContent = "Update Transaction";
    document.getElementById("txCancelEdit").classList.remove("hidden");
    return;
  }

  if (delId) {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await api(`/api/transactions/${delId}`, { method: "DELETE" });
      await Promise.all([loadTransactions(), loadDashboard(), loadBudget()]);
    } catch (err) {
      appMsg.textContent = err.message;
    }
  }
});

document.getElementById("applyFiltersBtn").addEventListener("click", async () => {
  state.filters.start = document.getElementById("filterStart").value;
  state.filters.end = document.getElementById("filterEnd").value;
  state.filters.category_id = document.getElementById("filterCategory").value;
  await loadTransactions();
});

document.getElementById("resetFiltersBtn").addEventListener("click", async () => {
  state.filters = { start: "", end: "", category_id: "" };
  document.getElementById("filterStart").value = "";
  document.getElementById("filterEnd").value = "";
  document.getElementById("filterCategory").value = "";
  await loadTransactions();
});

document.getElementById("saveBudgetBtn").addEventListener("click", async () => {
  appMsg.textContent = "";
  try {
    await api("/api/budget", {
      method: "PUT",
      body: JSON.stringify({
        month: document.getElementById("budgetMonth").value,
        amount: Number(document.getElementById("budgetAmount").value || 0),
      }),
    });
    await loadBudget();
  } catch (err) {
    appMsg.textContent = err.message;
  }
});

document.getElementById("budgetMonth").addEventListener("change", () => {
  loadBudget();
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const q = new URLSearchParams();
  if (state.filters.start) q.set("start", state.filters.start);
  if (state.filters.end) q.set("end", state.filters.end);
  if (state.filters.category_id) q.set("category_id", state.filters.category_id);
  window.location.href = `/api/export.csv?${q.toString()}`;
});

bootstrap();
