let amqp = require("amqplib/callback_api");

const sendMessageToQueue = (msg) => {
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
        channel.sendToQueue(queue, Buffer.from(msg));

        console.log(" [x] Sent %s", msg);
      });
      setTimeout(function () {
        connection.close();
        // process.exit(0);
      }, 500);
    }
  );
};

module.exports = sendMessageToQueue;
