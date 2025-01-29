async function connect() {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket("wss://chat.stormyyy.dev");

    socket.onopen = function(event) {
      console.log("Connection with server established!");
      resolve(socket);
    };

    socket.onerror = function (error) {
      reject(error);
    };
  })
}

(async () => {
  try {
    const socket = await connect();
    console.log("WebSocket connected:", socket);
    
    let username = prompt("Enter your username:", "bob");
    let password = prompt("Enter your password:", "bob");

    document.forms.message_send.onsubmit = function() {
      let out_msg = this.message.value;
      socket.send(`${username},${password},${out_msg}`);
      this.reset();
      this.message.focus();
      return false;
    }

    socket.onmessage = function(event) {
      let msg = event.data;
      let msgElement = document.createElement("div");
      msgElement.textContent = msg;
      document.getElementById("messages").prepend(msgElement);
    }
  } catch (error) {
    console.error("Failed to connect:", error);
  }
})();




