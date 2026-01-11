function renderGroup() {
  const app = document.getElementById("app");
  const group = State.groups.find(g => g.id === State.activeGroupId);

  if (!group) {
    State.view = "dashboard";
    renderApp();
    return;
  }

  app.innerHTML = `
    <!-- HEADER -->
    <header class="header">
      <div class="header-left">
        <img src="assets/logo.png" alt="PayWise logo" />
        <span>${group.name}</span>
      </div>

      <button class="theme-toggle" onclick="toggleTheme()">
        ${State.theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
    </header>

    <!-- MAIN -->
    <main class="main">
      <button onclick="goBack()" style="margin-bottom:16px;">← Back</button>
  

      <!-- MEMBERS -->
      <div class="auth-card">
        <h3>Members</h3>
        <p>${group.members.join(", ")}</p>
      </div>

      <!-- ADD EXPENSE -->
      <div class="auth-card" style="margin-top:24px;">
        <h3>Add Expense</h3>

        <label>Description</label>
        <input id="expenseDesc" placeholder="e.g. Grocery" />

        <label style="margin-top:12px;">Total Amount</label>
        <input id="expenseAmount" type="number" />

        <label style="margin-top:12px;">Paid by</label>
        <select id="expensePaidBy">
          ${group.members.map(m => `<option value="${m}">${m}</option>`).join("")}
        </select>

        <label style="margin-top:12px;">Split type</label>
        <select id="splitType" onchange="renderSplitInputs()">
          <option value="equal">Equal</option>
          <option value="custom">Custom amounts</option>
        </select>

        <div id="splitInputs" style="margin-top:12px;"></div>

        <p id="expenseError" style="color:#dc2626; font-size:13px;"></p>

        <button onclick="addExpense()" style="width:100%;">
          Add Expense
        </button>
      </div>

      <!-- EXPENSES -->
      <div class="auth-card" style="margin-top:24px;">
        <h3>Expenses</h3>
        ${renderExpenses(group)}
      </div>

      <!-- BALANCES -->
      <div class="auth-card" style="margin-top:24px;">
        <h3>Balances</h3>
        ${renderBalances(group)}
      </div>

      <!-- SETTLE UP PLACEHOLDER -->
      <div class="auth-card" style="margin-top:24px;">
  <h3>Settle Up</h3>
  ${renderSettlements(group)}
</div>

    </main>
  `;
}

/* ---------------- SPLIT INPUTS ---------------- */

function renderSplitInputs() {
  const splitType = document.getElementById("splitType").value;
  const container = document.getElementById("splitInputs");
  const group = State.groups.find(g => g.id === State.activeGroupId);

  if (splitType === "equal") {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <label>Amount per member</label>
    ${group.members.map(m => `
      <div style="display:flex; gap:10px; margin-top:8px;">
        <span style="width:80px;">${m}</span>
        <input
          type="number"
          class="split-input"
          data-member="${m}"
          placeholder="0"
        />
      </div>
    `).join("")}
  `;
}

/* ---------------- ADD EXPENSE ---------------- */

function addExpense() {
  const group = State.groups.find(g => g.id === State.activeGroupId);

  const desc = document.getElementById("expenseDesc").value.trim();
  const amount = Number(document.getElementById("expenseAmount").value);
  const paidBy = document.getElementById("expensePaidBy").value;
  const splitType = document.getElementById("splitType").value;
  const error = document.getElementById("expenseError");

  error.textContent = "";

  if (!desc || amount <= 0) {
    error.textContent = "Enter valid expense details";
    return;
  }

  let splits = {};

  if (splitType === "custom") {
    const inputs = document.querySelectorAll(".split-input");
    let total = 0;

    inputs.forEach(input => {
      const value = Number(input.value);
      const member = input.dataset.member;

      if (value > 0) {
        splits[member] = value;
        total += value;
      }
    });

    if (total !== amount) {
      error.textContent = "Split amounts must equal total amount";
      return;
    }
  }

  group.expenses.push({
    id: Date.now(),
    description: desc,
    amount,
    paidBy,
    splitType,
    splits
  });

  saveGroups();
  renderGroup();
}

/* ---------------- EXPENSES LIST ---------------- */

function renderExpenses(group) {
  if (group.expenses.length === 0) {
    return "<p style='color:#64748B;'>No expenses yet</p>";
  }

  return `
    ${group.expenses.map(e => {
      const splitLabel =
        e.splitType === "equal"
          ? "Split equally"
          : "Custom split";

      return `
        <div style="
          padding:12px;
          margin-top:10px;
          border-radius:12px;
          background:#1E293B;
        ">
          <div style="display:flex; justify-content:space-between;">
            <strong>${e.description}</strong>
            <strong>₹${e.amount}</strong>
          </div>

          <div style="font-size:13px; color:#94A3B8; margin-top:4px;">
            Paid by ${e.paidBy} • ${splitLabel}
          </div>
        </div>
      `;
    }).join("")}
  `;
}


/* ---------------- BALANCE CALCULATION ---------------- */
function calculateBalances(group) {
  const balances = {};
  group.members.forEach(m => balances[m] = 0);

  group.expenses.forEach(exp => {

    /* -------- NORMALIZE SPLITS -------- */

    let splits = {};

    // If custom split but splits missing → fallback to equal
    if (
      exp.splitType === "custom" &&
      (!exp.splits || Object.keys(exp.splits).length === 0)
    ) {
      const equalShare = exp.amount / group.members.length;
      group.members.forEach(m => {
        splits[m] = equalShare;
      });
    }

    // Proper equal split
    if (exp.splitType === "equal") {
      const share = exp.amount / group.members.length;
      group.members.forEach(m => {
        splits[m] = share;
      });
    }

    // Proper custom split
    if (exp.splitType === "custom" && Object.keys(exp.splits).length > 0) {
      splits = exp.splits;
    }

    /* -------- APPLY BALANCES -------- */

    // Everyone owes their share
    group.members.forEach(m => {
      balances[m] -= splits[m] || 0;
    });

    // Payer gets full amount
    balances[exp.paidBy] += exp.amount;
  });

  return balances;
}

function renderBalances(group) {
  const balances = calculateBalances(group);

  return `
    ${Object.entries(balances).map(([name, amount]) => `
      <div style="
        display:flex;
        justify-content:space-between;
        padding:10px;
        margin-top:8px;
        border-radius:10px;
        background:${amount >= 0 ? "#052e1c" : "#3f1d1d"};
        color:${amount >= 0 ? "#22c55e" : "#ef4444"};
      ">
        <span>${name}</span>
        <span>
          ${amount >= 0
            ? `gets ₹${amount.toFixed(2)}`
            : `owes ₹${Math.abs(amount).toFixed(2)}`
          }
        </span>
      </div>
    `).join("")}
  `;
}


/* ---------------- NAVIGATION ---------------- */

function goBack() {
  State.activeGroupId = null;
  State.view = "dashboard";
  renderApp();
}
/* ---------------- SETTLEMENTS ---------------- */
function calculateSettlements(group) {
  const balances = calculateBalances(group);

  const debtors = [];
  const creditors = [];

  Object.entries(balances).forEach(([name, amount]) => {
    if (amount < 0) {
      debtors.push({ name, amount: Math.abs(amount) });
    }
    if (amount > 0) {
      creditors.push({ name, amount });
    }
  });

  const settlements = [];
  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const payAmount = Math.min(debtor.amount, creditor.amount);

    settlements.push({
      from: debtor.name,
      to: creditor.name,
      amount: payAmount
    });

    debtor.amount -= payAmount;
    creditor.amount -= payAmount;

    if (debtor.amount === 0) i++;
    if (creditor.amount === 0) j++;
  }

  return settlements;
}
/* ---------------- RENDER SETTLEMENTS ---------------- */
function renderSettlements(group) {
  const settlements = calculateSettlements(group);

  if (settlements.length === 0) {
    return `<p style="color:#64748B;">All settled 🎉</p>`;
  }

  return `
    ${settlements.map(s => `
      <div style="
        display:flex;
        justify-content:space-between;
        padding:12px;
        margin-top:8px;
        border-radius:10px;
        background:#1E293B;
      ">
        <span>
          <strong>${s.from}</strong> pays <strong>${s.to}</strong>
        </span>
        <span>₹${s.amount.toFixed(2)}</span>
      </div>
    `).join("")}
  `;
}
