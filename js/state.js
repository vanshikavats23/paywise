const State = {
  groups: JSON.parse(localStorage.getItem("paywise_groups")) || [],
  currentView: "dashboard",
  activeGroupId: null
};

function saveState() {
  localStorage.setItem("paywise_groups", JSON.stringify(State.groups));
}
