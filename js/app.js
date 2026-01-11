function switchView(view) {
  State.view = view;
  renderApp();
}
function renderApp() {
  const app = document.getElementById("app");

  // AUTH SCREENS → BLUE BACKGROUND
  if (State.view === "login" || State.view === "signup") {
    document.body.classList.add("auth");
  } else {
    document.body.classList.remove("auth");
  }

  if (State.view === "login") {
    renderLogin();
  } else if (State.view === "signup") {
    renderSignup();
  }
}

// BOOTSTRAP
window.onload = function () {
  const loader = document.getElementById("loader");
  const app = document.getElementById("app");

  // Show loader, hide app
  loader.style.display = "flex";
  app.style.display = "none";

  setTimeout(() => {
    loader.style.display = "none";
    app.style.display = "flex";
    renderApp();
  }, 1400);
};
