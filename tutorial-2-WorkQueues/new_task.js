import amqp from "amqplib/callback_api.js";

amqp.connect("amqp://localhost", (err, connection) => {
  if (err) {
    throw err;
  }

  connection.createChannel((err, channel) => {
    if (err) throw err;

    let queue = "task_queue";
    var msg = process.argv.slice(2).join(" ") || "Hello World!";

    channel.assertQueue(queue, {
      durable: true, // Saves message to disk
    });

    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true, // Saves message to disk
    });
    console.log(" [x] Sent %s", msg);
  });

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
});
