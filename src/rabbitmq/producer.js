
config = require("../config");
const { v4: uuidv4 } = require("uuid");


class Producer {
  channel;
  replyQueueName;
  eventEmitter;
  uuid;
  constructor(channel, replyQueueName, eventEmitter) {
    this.channel = channel;
    this.replyQueueName = replyQueueName;
    this.eventEmitter = eventEmitter;
  }

  async produceMessages(data) {
    this.uuid = uuidv4();
    console.log("the corr id is ", this.uuid);
    this.channel.sendToQueue(        
      config.rabbitMQ.queues.mTwoQueue,
      Buffer.from(JSON.stringify(data)),
      {
        replyTo: this.replyQueueName,
        correlationId: this.uuid,
        expiration: 10,       
      }
    );

    return new Promise((resolve, reject) => {
        this.eventEmitter.once(this.uuid, async (data) => {
        const reply = JSON.parse(data.content.toString());
        resolve(reply);
      });
    });
  }
}
module.exports = Producer;