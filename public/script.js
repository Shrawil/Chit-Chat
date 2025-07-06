const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const usernameInput = document.getElementById('username');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = usernameInput.value || "Anonymous";
  if (input.value.trim()) {
    socket.emit('chat message', {
      user: username,
      text: input.value
    });
    input.value = '';
  }
});

socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.textContent = `${msg.user}: ${msg.text}`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});
