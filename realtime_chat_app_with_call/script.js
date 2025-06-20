const socket = io();
let username = "";

function login() {
  const number = document.getElementById("number").value;
  const password = document.getElementById("password").value;
  if ((number === "9745526484" && password === "barsha") || (number === "1234567890" && password === "rajan")) {
    username = number === "9745526484" ? "Barsha" : "Rajan";
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("chat-screen").style.display = "block";
    document.getElementById("welcome-msg").textContent = "Welcome " + username;
  } else {
    alert("Invalid login");
  }
}

function sendMessage() {
  const input = document.getElementById("msg-input");
  const message = input.value;
  if (message) {
    const time = new Date().toLocaleTimeString();
    socket.emit("chat", { user: username, msg: message, time });
    input.value = "";
  }
}

socket.on("chat", data => {
  const box = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.innerHTML = `<b>${data.user}</b> [${data.time}]: ${data.msg}`;
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
});

function startVoiceCall() {
  alert("Voice Call feature to be added (WebRTC).");
}

function startVideoCall() {
  alert("Video Call feature to be added (WebRTC).");
}

// WebRTC logic
