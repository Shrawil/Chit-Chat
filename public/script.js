let socket;
let currentUser = "";

function login() {
  const username = document.getElementById("login-username").value.trim();
  if (!username) {
    alert("Please enter a username.");
    return;
  }

  currentUser = username;
  socket = io();

  socket.emit("login", currentUser);

  socket.on("login error", (msg) => {
    alert(msg);
    location.reload(); // reload so user can try a different name
  });

  socket.on("connect", () => {
    document.getElementById("login").style.display = "none";
    document.getElementById("chat").style.display = "flex";
    initChat();
  });

  socket.on("chat message", (msg) => {
    const item = document.createElement("li");
    item.textContent = `${msg.user}: ${msg.text} [${msg.time}]`;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  });

  socket.on("user list", (userList) => {
    document.getElementById("users").textContent = `Online: ${userList.join(", ")}`;
  });
}

function initChat() {
  const form = document.getElementById("form");
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value.trim()) {
      socket.emit("chat message", {
        user: currentUser,
        text: input.value.trim(),
        time: new Date().toLocaleTimeString()
      });
      input.value = "";
    }
  });
}
