const ISubscriber = require("./subscriber.js");
const { PubSub } = require("@google-cloud/pubsub");
const deepcopy = require("deepcopy");

class GCPSubscriber extends ISubscriber {
  constructor(_encoder, topicName, subscriptionName) {
    super(_encoder);
    this.connection = null;
    this.topicName = topicName;
    this.subscriptionName = subscriptionName;
    this.subscription = null;
  }

  static formatConfNamespace(template, namespace) {
    if (
      typeof template === "undefined" ||
      typeof template.attributes === "undefined"
    ) {
      return template;
    }
    var conf = deepcopy(template);
    conf.attributes[1] = `${conf.attributes[1]}.${namespace}`;
    return conf;
  }

  _connection(resolve, reject) {
    this.connection = new PubSub();

    const topic = this.connection.topic(this.topicName);
    const subscription = topic.subscription(this.subscriptionName);

    return topic
      .subscription(this.subscriptionName)
      .exists()
      .then((exists) => {
        const subscriptionExists = exists[0];
        if (subscriptionExists) {
          return subscription;
        } else {
          return subscription.create().then((subscriptionResponse) => {
            const [subscription] = subscriptionResponse;
            return subscription;
          });
        }
      })
      .then((subscription) => {
        this.subscription = subscription;
        resolve(this.subscription);
      })
      .catch((e) => {
        reject(e);
      });
  }

  terminate() {
    if (this.connection === null) {
      console.log("Terminating connection that was never established");
      return;
    }
    if (this.subscription) {
      this.subscription.removeAllListeners("message");
    }
    this.connection.close();
    this.connection = null;
  }

  consumeMessage(msg) {
    this._executeReceiveCallback(msg);
  }

  listenForMessages(timeout = null) {
    if (!this.connection) {
      throw new Error("No established connection found");
    }

    if (this.subscription) {
      this.subscription.on("message", (msg) => this.consumeMessage(msg));

      if (timeout) {
        setTimeout(() => {
          this.subscription.removeListener("message", (msg) =>
            this.consumeMessage(msg)
          );
        }, timeout);
      }
    }
  }
}

module.exports = GCPSubscriber;
