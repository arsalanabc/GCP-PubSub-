
const EncoderFactory = require('../src/encoder/encoder-factory')
const GCPEncoder = require('../src/encoder/gcp-encoder')

var IEncoder = require('../src/encoder/encoder')
var assert = require('chai').assert

class BadEncoder extends IEncoder {
}

describe('IEncoder unit tests', () => {
  it('should return an error when trying to instanciate IEncoder', () => {
    return new Promise((resolve) => {
      assert.throw(() => {
        var bad = new IEncoder()
      }, TypeError)
      resolve()
    })
  })

  it('should return an error if the implementation of IEncoder has no method "encode"', () => {
    return new Promise((resolve) => {
      var badPublisher = new BadEncoder()
      assert.throw(() => {
        badPublisher.encode()
      }, TypeError)
      resolve()
    })
  })

  it('should return an error if the implementation of IEncoder has no method "decode"', () => {
    return new Promise((resolve) => {
      var badPublisher = new BadEncoder()
      assert.throw(() => {
        badPublisher.decode()
      }, TypeError)
      resolve()
    })
  })

  it('should return an encoder with type json if no conf parameter', () => {
    var encoder = EncoderFactory.create()
    assert.instanceOf(encoder, GCPEncoder)
  })

  it('should return an encoder with type gcp with gcp conf parameter', () => {
    var conf = { encoder: 'gcp', attributes: [] }
    var encoder = EncoderFactory.create(conf)
    assert.instanceOf(encoder, GCPEncoder)
  })

  it('should return encoded json', () => {
    var encoder = EncoderFactory.create()
    var msg = encoder.encode({ test: 'test' })
    assert.equal(msg, '{"test":"test"}')
  })
})
