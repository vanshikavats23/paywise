function renderGroup() {
  const app = document.getElementById("app");
  const group = State.groups.find(g => g.id === State.activeGroupId);

  app.innerHTML = `
    <button class="secondary" onclick="goBack()">← Back</button>

    <div class="card">
      <h2>${group.name}</h2>
      <p><strong>Members:</strong> ${group.members.join(", ")}</p>
    </div>

    <div class="card">
      <h3>Expenses</h3>
      ${group.expenses.length === 0 ? "<p>No expenses yet</p>" : ""}
      ${group.expenses.map(e => `
        <p>${e.description} — ₹${e.amount} (Paid by ${e.paidBy})</p>
      `).join("")}
    </div>
  `;
}

function goBack() {
  State.currentView = "dashboard";
  State.activeGroupId = null;
  renderApp();
}
