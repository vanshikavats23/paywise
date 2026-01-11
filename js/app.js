function renderApp() {
  if (State.currentView === "dashboard") {
    renderDashboard();
  } else if (State.currentView === "group") {
    renderGroup();
  }
}

renderApp();
