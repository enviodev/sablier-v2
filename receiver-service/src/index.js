#!/usr/bin/env node

var amqp = require("amqplib/callback_api");
var sendWebhookMessage = require("./send-discord-webhook.js");

// amqp.connect("amqp://localhost", function (error0, connection) {
amqp.connect(
  "amqps://odfiymdd:Jx9pYlQ4JQPPE9egmes0iU7sIgPxwmNW@sparrow.rmq.cloudamqp.com/odfiymdd",
  function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      var queue = "sablier";

      channel.assertQueue(queue, {
        durable: false,
      });

      console.log(
        " [*] Waiting for messages in %s. To exit press CTRL+C",
        queue
      );

      channel.consume(
        queue,
        function (msg) {
          console.log(" [x] Received %s", msg.content.toString());
          sendWebhookMessage(msg.content.toString());
        },
        {
          noAck: true,
        }
      );
    });
  }
);
