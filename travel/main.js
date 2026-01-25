let username;
let expenses;
let todos;
let chart;

// ---------- 起動 ----------
function start() {
  username = document.getElementById("usernameInput").value.trim();
  if (!username) return;

  localStorage.setItem("lastUser", username);

  document.getElementById("nameScreen").style.display = "none";
  document.getElementById("app").style.display = "block";
  document.getElementById("userTitle").innerText = `👤 ${username}`;

  loadData();
  initChart();
  renderTodos();
  loadQR();
}

// ---------- データ ----------
function loadData() {
  expenses = JSON.parse(localStorage.getItem(username + "_expenses")) || {
    食事: 0, 交通: 0, 宿泊: 0, その他: 0
  };
  todos = JSON.parse(localStorage.getItem(username + "_todos")) || [];
}

// ---------- 家計簿 ----------
function initChart() {
  const ctx = document.getElementById("pieChart");
  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(expenses),
      datasets: [{ data: Object.values(expenses) }]
    }
  });
  updateTotal();
}

function addExpense() {
  const category = document.getElementById("category").value;
  const amount = Number(document.getElementById("amount").value);
  if (!amount) return;

  expenses[category] += amount;
  localStorage.setItem(username + "_expenses", JSON.stringify(expenses));

  chart.data.datasets[0].data = Object.values(expenses);
  chart.update();
  updateTotal();

  document.getElementById("amount").value = "";
}

function updateTotal() {
  const sum = Object.values(expenses).reduce((a, b) => a + b, 0);
  document.getElementById("total").innerText = `合計：¥${sum.toLocaleString()}`;
}

// ---------- TODO ----------
function addTodo() {
  const text = document.getElementById("todoInput").value.trim();
  if (!text) return;

  todos.push({ text, done: false });
  localStorage.setItem(username + "_todos", JSON.stringify(todos));
  renderTodos();
  document.getElementById("todoInput").value = "";
}

function renderTodos() {
  const ul = document.getElementById("todoList");
  ul.innerHTML = "";

  todos.forEach((todo, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <label>
        <input type="checkbox" ${todo.done ? "checked" : ""}>
        ${todo.text}
      </label>
    `;
    li.querySelector("input").onchange = () => {
      todo.done = !todo.done;
      localStorage.setItem(username + "_todos", JSON.stringify(todos));
    };
    ul.appendChild(li);
  });
}

// ---------- QR ----------
function uploadQR(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    localStorage.setItem(username + "_qr", reader.result);
    document.getElementById("qrImage").src = reader.result;
  };
  reader.readAsDataURL(file);
}

function loadQR() {
  const qr = localStorage.getItem(username + "_qr");
  if (qr) document.getElementById("qrImage").src = qr;
}

// ---------- 自動復帰 ----------
window.onload = () => {
  const lastUser = localStorage.getItem("lastUser");
  if (lastUser) {
    document.getElementById("usernameInput").value = lastUser;
  }
};


