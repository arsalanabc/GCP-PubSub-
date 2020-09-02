var SubscriberFactory = require("../src/subscriber/subscriber-factory");
var PubSubSubscriber = require("../src/subscriber/gcp-subscriber");
var ISubscriber = require("../src/subscriber/subscriber");
var assert = require("chai").assert;
var sinon = require("sinon");

describe("SubscriberFactory unit tests", () => {
  const template = {
    subscriber: "dummy",
  };

  it("should create a DummySubscriber if not config provided", () => {
    return new Promise((resolve) => {
      var myPublisher = SubscriberFactory.create();
      assert.instanceOf(myPublisher, DummySubscriber);
      resolve();
    });
  });

  it('should generate a subscriber using "create"', () => {
    return new Promise((resolve) => {
      var mySubscriber = SubscriberFactory.create({});
      assert.instanceOf(mySubscriber, ISubscriber);
      resolve();
    });
  });

  it("should generate a PubSub subscriber", () => {
    return new Promise((resolve) => {
      var mySubscriber = SubscriberFactory.create({
        subscriber: "pubsub",
        attributes: [],
        encoder: "gcp",
      });
      assert.instanceOf(mySubscriber, PubSubSubscriber);
      resolve();
    });
  });
});
