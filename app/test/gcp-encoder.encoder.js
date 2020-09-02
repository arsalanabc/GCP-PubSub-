const EncoderFactory = require("../src/encoder/encoder-factory");
const GCPEncoder = require("../src/encoder/gcp-encoder");

var assert = require("chai").assert;

describe("IEncoder unit tests", () => {
  var conf = { encoder: "gcp", attributes: [] };
  var encoder = EncoderFactory.create(conf);

  it("should return an encoder with type gcp with gcp conf parameter", () => {
    assert.instanceOf(encoder, GCPEncoder);
  });

  it("should return encoded data in buffer", () => {
    let data = { test: "test" };
    let bData = Buffer.from(JSON.stringify(data));

    var msg = encoder.encode(data);
    assert.deepEqual(msg, bData);

    data = "string";
    bData = Buffer.from(data);

    var msg = encoder.encode(data);
    assert.deepEqual(msg, bData);
  });

  it("should return decoded gcp message", () => {
    const bufferedData = Buffer.from("this is a test");
    const data = { test: "test", data: bufferedData };

    var msg = encoder.decode(data);
    assert.equal(msg.data, "this is a test");
  });
});
