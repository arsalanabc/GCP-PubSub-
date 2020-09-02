const GCPSubscription = require("./subscription/gcp-subscriptions");
const GCPPublisher = require("./publisher/gcp-publisher");
const { PROJECT_ID, SUB_NAME, TOPIC_NAME } = require("./constants");

console.log("Make sure PubSub is running!!")

const data = JSON.stringify({foo: 'bar'})

const pubsub = new GCPPublisher(PROJECT_ID);

pubsub.setTopic(TOPIC_NAME)

pubsub.publishMessage(data).catch(console.error);

const subscription = new GCPSubscription(PROJECT_ID,TOPIC_NAME);
subscription.createSubscription(SUB_NAME);
subscription.listenForMessages();
