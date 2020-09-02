const {PubSub} = require("@google-cloud/pubsub");
const {EMULATOR_ENDPOINT} = require("../constants")

const options = {
    pushConfig: {
      // Set to your local endpoint.
      pushEndpoint: EMULATOR_ENDPOINT,
    },
  }

class GCPPublisher {
 constructor(projectId){
   
     this.pubsub = new PubSub(projectId, options);

     console.log(this.pubsub)
 }

 setTopic = async function(topicName){
    this.topicName = topicName;
 }

 publishMessage = async function (data) {

    // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
    const dataBuffer = Buffer.from(data);
    const topic = this.pubsub.topic(this.topicName)

    topic.get({ autoCreate: true }, async function(err, topic) {
        const messageId = await topic.publish(dataBuffer);
        console.log(`Message ${messageId} published.`);
      });
  }
}

module.exports = GCPPublisher;