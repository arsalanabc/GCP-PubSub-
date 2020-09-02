/**
 * Base class to implement data parsing and unparsing
 */
class IEncoder {
  constructor () {
    if (this.constructor.name === 'IEncoder') {
      throw new TypeError('Abstract class "IEncoder" cannot be instanciated')
    }
  }

  encode (messageDict) {
    throw new TypeError('"IEncoder" sub-class must implement "encode" method')
  }

  decode (message) {
    throw new TypeError('"IEncoder" sub-class must implement "decode" method')
  }
}

module.exports = IEncoder
