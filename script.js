async function connect() {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket("wss://chat.stormyyy.dev");

    socket.onopen = function(event) {
      console.log("Connection with server established!");
      resolve(socket);
    };

    socket.onerror = function (error) {
      console.log(error);
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
      console.log(msg);
      if (msg == `[${username}]: !givemedoom`) {
        let doomElement = document.createElement("iframe");
        doomElement.src = "https://ustymukhman.github.io/webDOOM/public/";
        doomElement.classList.add("doom");

        document.getElementById("messages").prepend(doomElement);
        return;
      }

      if (msg == `[${username}]: !minecraftforfree`) {
        let mcElement = document.createElement("iframe");
        mcElement.src = "https://games.stormyyy.dev/minecraft";
        mcElement.classList.add("minecraft");

        document.getElementById("messages").prepend(mcElement);
        return;
      }

      if (msg == `[${username}]: !givemeslope`) {
        let slopeElement = document.createElement("iframe");
        slopeElement.src = "https://y8.com/embed/slope";
        slopeElement.scrolling= "no";
        slopeElement.classList.add("slope");
      }

      if (msg ==`[${username}]: !givemerick`) {
        let video = document.createElement("video");
        video.controls = false;
        video.autoplay = true;
        video.classList.add("rick");

        let source = document.createElement("source");
        source.src = "https://dn720407.ca.archive.org/0/items/rick-roll/Rick%20Roll.mp4";
        source.type = "video/mp4";

        video.appendChild(source);
        document.getElementById("messages").prepend(video);

        return;
      }

      let msgElement = document.createElement("div");
      msgElement.textContent = msg;
      document.getElementById("messages").prepend(msgElement);
    }

    setInterval(() => {
      socket.send("ping");
      //console.log("Sent ping to server");
    }, 10000);

  } catch (error) {
    console.error("Failed to connect:", error);
  }
})();
