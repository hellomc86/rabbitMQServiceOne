const amqp = require('amqplib');

const config = require("../config");
Consumer= require("./consumer");
Producer= require("./producer");
const EventEmitter = require ('events');

class RabbitMQClientM1 {  
  isInitialized =false;
  producer;
  consumer;  
  connection;  
  producerChannel;
  consumerChannel;
  eventEmitter;
  
  async initialize() {
    if (this.isInitialized) {
      return;
    }
    try {
      this.connection = await amqp.connect(config.rabbitMQ.url);

      this.producerChannel = await this.connection.createChannel();
      this.consumerChannel = await this.connection.createChannel();

      const { queue: replyQueueName } = await this.consumerChannel.assertQueue(
        "",
        { exclusive: true }
      );

      console.log("replyQueue name: ", replyQueueName);

      this.eventEmitter = new EventEmitter();
      this.producer = new Producer(
        this.producerChannel,
        replyQueueName,
        this.eventEmitter
      );
      this.consumer = new Consumer(
        this.consumerChannel,
        replyQueueName,
        this.eventEmitter
      );

      this.consumer.consumeMessages();

      this.isInitialized = true;
    } catch (error) {
      console.log("rabbitmq error...", error);
    }
  }
  async produce(data) {
    if (!this.isInitialized) {
      await initialize();
    }
    return await this.producer.produceMessages(data);
  }
}

module.exports = RabbitMQClientM1;
