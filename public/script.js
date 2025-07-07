let socket;
let currentUser = "";

async function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    document.getElementById("login").style.display = "none";
    document.getElementById("chat").style.display = "flex";
    currentUser = username;
    initChat();
  } else {
    alert("Invalid username or password");
  }
}

function initChat() {
  socket = io();

  const form = document.getElementById("form");
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value.trim()) {
      socket.emit("chat message", {
        user: currentUser,
        text: input.value,
        time: new Date().toLocaleTimeString()
      });
      input.value = "";
    }
  });

  socket.on("chat message", (msg) => {
    const item = document.createElement("li");
    item.textContent = `${msg.user}: ${msg.text} [${msg.time}]`;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  });
}
