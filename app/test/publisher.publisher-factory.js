var PublisherFactory = require("../src/publisher/publisher-factory");
var IPublisher = require("../src/publisher/publisher");
var PubSubPublisher = require("../src/publisher/gcp-publisher");
var assert = require("chai").assert;
var sinon = require("sinon");

describe("PublisherFactory unit tests", () => {
  const template = {
    publisher: "pubsub",
  };

  it("should create a PubSubPublisher if not config provided", () => {
    return new Promise((resolve) => {
      var myPublisher = PublisherFactory.create();
      assert.instanceOf(myPublisher, PubSubPublisher);
      resolve();
    });
  });

  it('should generate a publisher using "createPublisher"', () => {
    return new Promise((resolve) => {
      var myPublisher = PublisherFactory.create({});
      assert.instanceOf(myPublisher, IPublisher);
      resolve();
    });
  });

  it("should generate a PubSub publisher", () => {
    return new Promise((resolve) => {
      var myPublisher = PublisherFactory.create({
        publisher: "pubsub",
        attributes: [],
        encoder: "gcp",
      });
      assert.instanceOf(myPublisher, PubSubPublisher);
      resolve();
    });
  });
});
