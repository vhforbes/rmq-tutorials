import amqp from "amqplib/callback_api.js";

amqp.connect("amqp://localhost", (err, connection) => {
  if (err) throw err;

  connection.createChannel((err, channel) => {
    if (err) throw err;

    let queue = "task_queue";

    channel.assertQueue(queue, {
      durable: true,
    });

    channel.prefetch(1); // Fair dispatch

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(
      queue,
      (msg) => {
        console.log(" [x] Received %s", msg.content.toString());
        let secs = msg.content.toString().split(".").length - 1;

        setTimeout(() => {
          console.log(" [x] Done");
          channel.ack(msg); // Acknoledge the work has finished, message processed
        }, secs * 1000);
      },
      {
        noAck: false, // If true it will consider that the task was processed as soon as received
      }
    );
  });
});
