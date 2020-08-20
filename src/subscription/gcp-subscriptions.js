const {PubSub, Subscription} = require("@google-cloud/pubsub");
const {EMULATOR_ENDPOINT} = require("../constants")



const options = {
    pushConfig: {
      // Set to your local endpoint.
      pushEndpoint: EMULATOR_ENDPOINT,
    },
  };

class GCPSubscription {
 constructor(projectId, topicName){
    this.subscriptionName = "";
    this.topicName = topicName;
    this.pubsubClient = new PubSub(projectId, options);
 }

 createSubscription = async function(subscriptionName) {
     this.subscriptionName = subscriptionName

    this.pubsubClient.subscription(this.subscriptionName).getMetadata().then(subscription => {
      if(subscription) return ;
    }).catch(e => {

      if(e.code === 5){ // Subscriptions not found
        this.pubsubClient.topic(this.topicName).createSubscription(this.subscriptionName);
      } else{
        console.error(e)
      }
    })
  }


  listenForMessages = function(){
    const self = this;
    this.pubsubClient.topic(this.topicName).get({ autoCreate: true }, async function(err, topic) {
      self.startListener(topic)
    })
  }

  startListener = async function(topic){
  
    // References an existing subscription
    const subscription = await topic.subscription(this.subscriptionName, {autoCreate:true});

    // Create an event handler to handle messages
    let messageCount = 0;
    const messageHandler = message => {
      console.log(`Received message ${message.id}:`);
      console.log(`\tData: ${message.data}`);
      console.log(`\tAttributes: ${JSON.stringify(message.attributes)}`);
      messageCount += 1;

      // "Ack" (acknowledge receipt of) the message
      message.ack();
    };

    // Listen for new messages until timeout is hit
    subscription.on('message', messageHandler);

    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      // this.pubsubClient.topic(this.topicName).delete();
      // this.pubsubClient.subscription(this.subscriptionName).delete();
      console.log(`${messageCount} message(s) received.`);
    },  5000);

  }

}

module.exports = GCPSubscription