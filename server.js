express = require("express");
const RabbitMQClientM1 = require("./src/rabbitmq/client");

const rabbitmqClient = new RabbitMQClientM1();

const server = express();

server.use(express.json()); // you need the body parser middleware

server.post("/twice", async (req, res, next) => {
  console.log(req.body);
  const response = await rabbitmqClient.produce(req.body);
  res.send({ response });
});

server.listen(3001, async () => {
  console.log("Server running...");
  rabbitmqClient.initialize();
});
