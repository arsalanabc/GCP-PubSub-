const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const { PubSub } = require("@google-cloud/pubsub");

const EncoderFactory = require("../src/encoder/encoder-factory");
const GCPPublisher = require("../src/publisher/gcp-publisher");
chai.use(chaiAsPromised);

const expect = chai.expect;
const assert = chai.assert;

var encoder = EncoderFactory.create({
  encoder: "gcp",
});

const VARS = {
  PROJECT_ID: "test-project",
  TOPIC_NAME: "test_topic_1",
  SUB_NAME: "test_sub_1",
};

describe("GCPPublisher unit tests", () => {
  var publisher = null;
  
  // PubSub points to the same service as our Subscriber. We use
  // to munipulate resourses using PubSub directly to make our test
  // behave in a certain way
  const pubsub = new PubSub();

  beforeEach(() => {
    publisher = new GCPPublisher(encoder, VARS.TOPIC_NAME);
  });

  afterEach(() => {
    publisher.terminate();
    publisher = null;
  });

  it("should set up", () => {
    assert.notEqual(publisher, null);
  });

  it("should use the testing emulator", async () => {
    const topic = await publisher.connect();

    assert.equal(topic.pubsub.projectId, VARS.PROJECT_ID);
    assert.isTrue(topic.pubsub.isEmulator);

    await publisher.deleteTopic();
  });

  it("should notify when ready", () => {
    return new Promise((resolve) => {
      publisher.connect().then(() => {
        resolve();
      });
    });
  });

  it("should create a topic on connect", async () => {
    const topic = await publisher.connect();
    assert.include(topic.name, VARS.TOPIC_NAME);

    await publisher.deleteTopic();
  });

  it("should delete a topic", async () => {
    await publisher.connect();
    await publisher.deleteTopic();

    await expect(publisher.publish("message 2")).to.be.rejectedWith(
      "Topic no found"
    );
  });

  it("should publish to the topic", async () => {
    await publisher.connect();

    const data = JSON.stringify({ foo: "bar" });

    let messageId = await publisher.publish(data);
    assert.equal(messageId, "1");

    messageId = await publisher.publish("message 2");
    assert.equal(messageId, "2");

    await publisher.deleteTopic();
  });
});
