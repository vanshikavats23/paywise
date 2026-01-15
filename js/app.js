function switchView(view) {
  State.view = view;
  renderApp();
}
function renderApp() {
  /* 🔐 SESSION GUARD */
  if (State.user && (State.view === "login" || State.view === "signup")) {
    State.view = "dashboard";
  }

  if (!State.user && (State.view === "dashboard" || State.view === "group")) {
    State.view = "login";
  }

  // Auth background
  if (State.view === "login" || State.view === "signup") {
    document.body.classList.add("auth");
  } else {
    document.body.classList.remove("auth");
  }

  if (State.view === "login") {
    renderLogin();
  } 
  else if (State.view === "signup") {
    renderSignup();
  } 
  else if (State.view === "dashboard") {
    renderDashboard();
  } 
  else if (State.view === "group") {
    renderGroup();
  }
}


// APP BOOTSTRAP
window.onload = async () => {
  const loader = document.getElementById("loader");
  const app = document.getElementById("app");

  setTimeout(async () => {
    loader.style.display = "none";
    app.style.display = "flex";

    const token = localStorage.getItem("paywise_token");

    if (token) {
      try {
        const res = await fetch("http://localhost:5001/api/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (data.success) {
          State.user = data.user;
          State.view = "dashboard";
        } else {
          localStorage.removeItem("paywise_token");
          State.view = "login";
        }
      } catch {
        State.view = "login";
      }
    } else {
      State.view = "login";
    }

    renderApp();
  }, 1200);
};
