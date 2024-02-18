document.addEventListener("DOMContentLoaded", function() {
    const chatBox = document.getElementById("my-chatbox");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    sendBtn.addEventListener("click", function() {
      const message = userInput.value;


      if (message.trim() === "") return;
  
      // Display user message in chat box
      appendMessage("You", message);
  
      // Send message to server
      sendMessageToServer(message)
        .then(response => {
          // Display server response in chat box
          appendMessage("Chatbot", truncateMessage(response));
        })
        .catch(error => {
          console.error("Error:", error);
        });
  
      // Clear user input
      userInput.value = "";
    });
  
    function appendMessage(sender, message) {
      const messageElement = document.createElement("div");
      var side = sender === "Chatbot" ? "chat-left" : "chat-right"
      const timestamp = new Date().toLocaleTimeString();
      messageElement.innerHTML = `
        <div class="chat ${side}">
            <div class="chat-avatar">
                <a href="profile.html" class="avatar">
                    <img alt="John Doe" src="assets/img/user.jpg" class="img-fluid rounded-circle">
                </a>
            </div>
            <div class="chat-body">
                <div class="chat-bubble">
                    <div class="chat-content">
                        <span class="chat-user">${sender}</span> <span class="chat-time">${timestamp}</span>
                        <p>${message}</p>
                    </div>
                </div>
            </div>
        </div>
      `;
      chatBox.appendChild(messageElement);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  
    async function sendMessageToServer(message) {
      const response = await fetch("http://10.27.195.70:3001/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: message,
          model: "Neural-Chat-7B",
        })
      });
      console.log(response)
      const data = await response.json();
      return data.choices[0].text;
    }
    function truncateMessage(message) {
      const lastPeriodIndex = message.lastIndexOf('.');
      if (lastPeriodIndex !== -1) {
          return message.substring(0, lastPeriodIndex + 1); // Include the period
      } else {
          return message; // If there's no period, return the original message
      }
  }
  });