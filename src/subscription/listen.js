const GCPSubscription = require("./gcp-subscriptions");
const { SUB_NAME, TOPIC_NAME, PROJECT_ID } = require("../constants");

const subscription = new GCPSubscription(PROJECT_ID,TOPIC_NAME);
subscription.createSubscription(SUB_NAME);
subscription.listenForMessages();
