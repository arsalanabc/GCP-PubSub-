const GCPSubscription = require("./subscription/gcp-subscriptions");
const GCPPublisher = require("./publisher/gcp-publisher");
const { PROJECT_ID, SUB_NAME, TOPIC_NAME } = require("./constants");

const data = JSON.stringify({foo: 'bar'})

const pubsub = new GCPPublisher(PROJECT_ID);

pubsub.setTopic(TOPIC_NAME)

const subscription = new GCPSubscription(PROJECT_ID,TOPIC_NAME);
subscription.createSubscription(SUB_NAME);

pubsub.publishMessage(data).catch(console.error);

subscription.listenForMessages();
