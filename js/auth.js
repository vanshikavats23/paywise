function renderLogin() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="auth-card">
      <h2>Welcome back</h2>
      <input placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button>Sign in</button>
      <div class="auth-link" onclick="switchView('signup')">
        Don’t have an account? Sign up
      </div>
    </div>
  `;
}

function renderSignup() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="auth-card">
      <h2>Create account</h2>
      <input placeholder="Name" />
      <input placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button>Sign up</button>
      <div class="auth-link" onclick="switchView('login')">
        Already have an account? Sign in
      </div>
    </div>
  `;
}
