const IEncoder = require("./encoder");

class GCPEncoder extends IEncoder {
  encode(msg) {
    return typeof msg === "object"
      ? Buffer.from(JSON.stringify(msg))
      : Buffer.from(msg);
  }

  decode(message) {
    const result = message;
    if (typeof message === "object" && "data" in message) {
      result.data = message.data.toString("utf8");
    }
    return result;
  }
}

module.exports = GCPEncoder;
