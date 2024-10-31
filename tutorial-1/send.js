import amqp from "amqplib/callback_api.js";

amqp.connect("amqp://localhost", (err, connection) => {
  if (err) {
    throw err;
  }

  connection.createChannel((err, channel) => {
    if (err) throw err;

    let queue = "hello";
    let msg = "Hello World 2";

    channel.assertQueue(queue, {
      durable: false,
    });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
});
