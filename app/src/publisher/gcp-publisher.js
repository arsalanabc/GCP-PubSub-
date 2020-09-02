const IPublisher = require("./publisher");
const { PubSub } = require("@google-cloud/pubsub");
const deepcopy = require('deepcopy')

class GCPPublisher extends IPublisher {
  constructor(_encoder, topicName) {
    super(_encoder);
    this.topicName = topicName;
    this.channel = null;
    this.topic = null;
  }

  static formatConfNamespace (template, namespace) {
    if (typeof template === 'undefined' || typeof template.attributes === 'undefined') {
      return template
    }
    var conf = deepcopy(template)
    conf.attributes[1] = `${conf.attributes[1]}.${namespace}`
    return conf
  }
  
  async deleteTopic() {
    if (this.topic) {
      return this.topic.delete().then(() => {
        this.topic = null;
      });
    }
  }

  _publishing(msg, resolve, reject) {
    if (!this.topic) {
      reject(new Error("Topic no found"));
    }
    const dataBuffer = Buffer.from(msg);
    this.topic.publish(this.encoder.encode(msg)).then((msgId) => {
      console.log(" Message %s Sent to Topic %s", dataBuffer, this.topicName);
      resolve(msgId);
    });
  }

  _connection(resolve, reject) {
    this.channel = new PubSub();
    return  this.channel
    .topic(this.topicName)
    .get({ autoCreate: true })
    .then((topic) => {
      const [topicReturned] = topic;
      this.topic = topicReturned;
      resolve(this.topic);
    })
    .catch((err) => {
      throw new Error(err.details);
    });
  }

  terminate() {
    if (this.channel === null) {
      console.log("Terminating connection that was never established");
      return;
    }

    this.channel.close();
    this.channel = null;

    console.log("Terminate GCPPublisher");
  }
}

module.exports = GCPPublisher;
