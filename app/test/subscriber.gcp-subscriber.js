const EncoderFactory = require("../src/encoder/encoder-factory");
const GCPSubscriber = require("../src/subscriber/gcp-subscriber");

const { PubSub } = require("@google-cloud/pubsub");

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
var sinon = require("sinon");

chai.use(chaiAsPromised);

const expect = chai.expect;
const assert = chai.assert;

const VARS = {
  PROJECT_ID: "test-project",
  TOPIC_NAME: "test_topic_1",
  SUB_NAME: "test_sub_1",
};

var encoder = EncoderFactory.create({
  encoder: "gcp",
});

describe("GCPSubscriber unit tests", function () {
  var subscriber = null;

  // PubSub points to the same service as our Subscriber. We use
  // to munipulate resourses using PubSub directly to make our test
  // behave in a certain way
  const pubsub = new PubSub();

  beforeEach(() => {
    subscriber = new GCPSubscriber(encoder, VARS.TOPIC_NAME, VARS.SUB_NAME);
  });

  it("should throw no topic error", async () => {
    await expect(subscriber.connect()).to.be.rejectedWith(
      "Subscription topic does not exist"
    );
  });

  it("Should create subscription at connect", async () => {
    const topic = pubsub.topic(VARS.TOPIC_NAME);
    await topic.get({ autoCreate: true });

    const subscription = await subscriber.connect();
    assert.include(subscription.name, VARS.SUB_NAME);

    await topic.subscription(VARS.SUB_NAME).delete();
    await topic.delete();
  });

  it("Should return existing subscription", async () => {
    const topic = pubsub.topic(VARS.TOPIC_NAME);
    await topic.get({ autoCreate: true });
    await topic.createSubscription(VARS.SUB_NAME);

    const subscription = await subscriber.connect();
    assert.include(subscription.name, VARS.SUB_NAME);

    await topic.subscription(VARS.SUB_NAME).delete();
    await topic.delete();
  });

  it("should establish connection a subscription", async function () {
    const topic = pubsub.topic(VARS.TOPIC_NAME);
    await topic.get({ autoCreate: true });

    await expect(subscriber.connect()).to.be.fulfilled;

    await topic.subscription(VARS.SUB_NAME).delete();
    await topic.delete();
  });

  it("should attach onReceive callback", () => {
    let data = 123;
    const stub = sinon.stub();
    subscriber.onReceive(stub);

    subscriber.consumeMessage(data);

    sinon.assert.calledWith(stub, data);
  });

  it("should receive and handle message with timeout", async () => {
    let messageId;

    const topic = pubsub.topic(VARS.TOPIC_NAME);

    await topic.create();
    await topic.createSubscription(VARS.SUB_NAME);
    await topic.get(VARS.TOPIC_NAME);

    let dataBuffer = Buffer.from(JSON.stringify({ foo: "bar" }));
    messageId = await topic.publish(dataBuffer);

    await subscriber.connect();

    subscriber.onReceive((msg) => {
      console.log("onReceve", msg);
      assert.equal(msg.data, JSON.stringify({ foo: "bar" }));
      assert.equal(msg.id, messageId);
    });

    subscriber.listenForMessages(1000);

    await topic.subscription(VARS.SUB_NAME).delete();
    await topic.delete();
  });

  it("should terminate connection", () => {
    const topic = pubsub.topic(VARS.TOPIC_NAME);

    return new Promise((resolve) => {
      topic
        .get({ autoCreate: true })
        .then(() => {
          return subscriber.connect();
        })
        .then(() => {
          subscriber.terminate();

          assert.throw(
            () => subscriber.listenForMessages(),
            "No established connection found"
          );
          resolve();
        })
        .then(() => {
          return topic.subscription(VARS.SUB_NAME).delete();
        })
        .then(() => {
          return topic.delete();
        });
    });
  });
});
