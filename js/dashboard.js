function renderDashboard() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="card">
      <h2>Your Groups</h2>

      <input id="groupNameInput" placeholder="Group name" />
      <input id="memberInput" placeholder="Initial member name" />
      <button onclick="createGroup()">Create Group</button>
    </div>

    ${State.groups.map(group => `
      <div class="card group-item">
        <div>
          <strong>${group.name}</strong><br/>
          <span>${group.members.length} members</span>
        </div>
        <button class="secondary" onclick="openGroup(${group.id})">Open</button>
      </div>
    `).join("")}
  `;
}

function createGroup() {
  const name = document.getElementById("groupNameInput").value.trim();
  const member = document.getElementById("memberInput").value.trim();

  if (!name || !member) return alert("All fields required");

  State.groups.push({
    id: Date.now(),
    name,
    members: [member],
    expenses: []
  });

  saveState();
  renderDashboard();
}

function openGroup(id) {
  State.currentView = "group";
  State.activeGroupId = id;
  renderApp();
}
