var IPublisher = require('../src/publisher/publisher')
const EncoderFactory = require('../src/encoder/encoder-factory')
var assert = require('chai').assert

var encoder = EncoderFactory.create({
  encoder: 'gcp'
})
class BadPublisher extends IPublisher {
  constructor () {
    super(encoder)
  }
}
describe('IPublisher unit tests', () => {
  
  it('should return an error when trying to instanciate IPublisher', () => {
    return new Promise((resolve) => {
      assert.throw(() => {
        var bad = new IPublisher(encoder)
      }, TypeError)
      resolve()
    })
  })

  it ('Should throw an error when calling formatConfNamespace on publisher', () => {
    assert.throw(() => {
      IPublisher.formatConfNamespace()
    }, TypeError)
  })

  it('should return an error if the implementation of IPublisher has no method "terminate"', () => {
    return new Promise((resolve) => {
      var badPublisher = new BadPublisher()
      assert.throw(() => {
        badPublisher.terminate()
      }, TypeError)
      resolve()
    })
  })

  it('should return an error if the implementation of IPublisher has no method "_connection"', () => {
    return new Promise((resolve) => {
      var badPublisher = new BadPublisher()
      badPublisher.connect().catch((alert) => {
        assert.throw(() => {
          throw alert
        }, TypeError)
      })
      resolve()
    })
  })

  it('should return an error if the implementation of IPublisher has no method "onPublish"', () => {
    return new Promise((resolve) => {
      var badPublisher = new BadPublisher()
      badPublisher.publish("test message").catch((alert) => {
        assert.throw(() => {
          throw alert
        }, TypeError)
      })
      resolve()
    })
  })
})
