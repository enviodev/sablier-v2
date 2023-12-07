const axios = require("axios");

const webhookUrl =
  "https://discord.com/api/webhooks/1181911762396782682/90yGLmHsVncGtOStENCqyxCLBHr-fITavnHdoAKwvUhWakyNGscc-SuZCAT6o2Ww3vQJ";

// Function to send a message to the Discord webhook
function sendWebhookMessage(content) {
  axios
    .post(webhookUrl, {
      content: content,
    })
    .then((response) => {
      console.log("Message sent to discord webhook", response.data);
    })
    .catch((error) => {
      console.error("Error sending message to webhook: ", error.message);
    });
}

module.exports = sendWebhookMessage;
