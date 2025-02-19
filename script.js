async function connect() {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket("wss://chat.stormyyy.dev");

    socket.onopen = function(event) {
      console.log("Connection with server established!");
      resolve(socket);
    };

    socket.onclose = function(event) {
      console.log(`WebSocket closed. Reconnecting... (Code: ${event.code})`);
      setTimeout(connect, 1000); // Reconnect after 1 sec
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
    
    let username = "";
    let password = "";
    let last_sender = "";

    document.forms['register'].onsubmit = function (event) {
      event.preventDefault();

      const email = this['email-register'].value;
      username = this['username-register'].value;
      password = this['password-register'].value;

      socket.send(`REGISTER,${username},${password},${email}`);
      this.reset();
      return false;
    };

    document.forms['login'].onsubmit = function(event) {
      event.preventDefault();

      username = this['username-login'].value;
      password = this['password-login'].value;

      socket.send(`LOGIN,${username},${password},"NULL"`);
      this.reset();
      return false;
    };

    document.forms.message_send.onsubmit = function() {
      let out_msg = this.message.value;
      socket.send(`USER_MESSAGE,${username},${password},${out_msg}`);
      this.reset();
      this.message.focus();
      return false;
    }

    socket.onmessage = function(event) {
      let split_msg = event.data.split(",");
      
      let msg_type = split_msg[0];
      let msg_username = split_msg[1];
      let msg = split_msg[2];

      if (msg_type === "RESPONSE_LOGIN_SUCCESS") {
        document.getElementById("error-message").textContent = "";
        document.getElementById("response-message").textContent = "";
        document.getElementById("chat").classList.remove("removed");
        document.getElementById("register-form").classList.add("removed");
        document.getElementById("login-form").classList.add("removed");
        return; // don't show this message
      } else if (msg_type === "RESPONSE_LOGIN_FAIL") {
        document.getElementById("error-message").textContent = "Error logging in.";
        document.getElementById("response-message").textContent = "";
        return;
      } else if (msg_type === "RESPONSE_REGISTER_SUCCESS") {
        document.getElementById("error-message").textContent = "";
        document.getElementById("response-message").textContent = `Registered as ${username} successfully!`
        document.getElementById("register-form").classList.add("removed");
      }
      
      console.log(event.data);
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

        document.getElementById("messages").prepend(slopeElement);
        return;
      }

      if (msg ==`[${username}]: !givemerick`) {
        let video = document.createElement("video");
        video.controls = true;
        video.autoplay = true;
        video.classList.add("rick");

        let source = document.createElement("source");
        source.src = "https://dn720407.ca.archive.org/0/items/rick-roll/Rick%20Roll.mp4";
        source.type = "video/mp4";

        video.appendChild(source);
        document.getElementById("messages").prepend(video);

        return;
      }

      if (msg ==`[${username}]: !drippybozo`) {
        let video = document.createElement("video");
        video.controls = true;
        video.autoplay = true;
        video.classList.add("drippy");

        let source = document.createElement("source");
        source.src = "https://stormyyy.dev/media/drippy.mp4";
        source.type = "video/mp4";

        video.appendChild(source);
        document.getElementById("messages").prepend(video);

        return;
      }

      if (msg ==`[${username}]: !ihatefun`) {
        // remove all games/videos added with commands

        return;
      }

      let msgElement = document.createElement("div");
      msgElement.classList = "message";
      
      if (last_sender != msg_username) {
        let msgHeading = document.createElement("div");
        msgHeading.classList = "message-heading";
        msgHeading.innerText = msg_username;
        msgElement.appendChild(msgHeading);
      }
      
      let msgContent = document.createElement("div");
      msgContent.classList = "message-content";
      msgContent.textContent = msg;
      msgElement.appendChild(msgContent);
      document.getElementById("messages").prepend(msgElement);

      last_sender = msg_username;
    }

    setInterval(() => {
      socket.send("ping");
      //console.log("Sent ping to server");
    }, 10000);

  } catch (error) {
    console.error("Failed to connect:", error);
  }
})();
