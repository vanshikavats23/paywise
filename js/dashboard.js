function renderDashboard() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <header class="header">
      <div class="header-left">
        <img src="assets/logo.png" alt="PayWise logo" />
        <span>PayWise</span>
      </div>
      <button class="theme-toggle" onclick="toggleTheme()">
        ${State.theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
      <button class="theme-toggle" onclick="logout()">Logout</button>
    </header>




    <main class="main">
      <h2>Good evening 👋</h2>
      <p style="color: #64748B; margin-bottom: 32px;">
        Here’s a quick look at your shared expenses
      </p>

      <!-- PLACEHOLDERS -->
      <div class="auth-card">
        <h3>Summary</h3>
        <p>Dashboard content will appear here</p>
      </div>

      <div class="auth-card" style="margin-top: 24px;">
        <h3>Your Groups</h3>
        <p>Groups list will appear here</p>
      </div>
    </main>
  `;
}
function logout() {
  State.view = "login";
  renderApp();
}

