var ISubscriber = require('../src/subscriber/subscriber')
const EncoderFactory = require('../src/encoder/encoder-factory')
var assert = require('chai').assert

var encoder = EncoderFactory.create({
  encoder: 'gcp'
})

class BadSubscriber extends ISubscriber {
  constructor () {
    super(encoder)
  }
}
describe('ISubscriber unit tests', function () {
  it('should return an error when trying to instanciate ISubscriber', async () => {
    assert.throw(() => {
      var bad = new ISubscriber(encoder)
    }, TypeError)
  })

  it ('Should throw an error when calling formatConfNamespace on publisher', () => {
    assert.throw(() => {
      ISubscriber.formatConfNamespace()
    }, TypeError)
  })

  it('should return an error if the implementation of ISubscriber has no method "terminate"', () => {
    return new Promise((resolve) => {
      var badSubscriber = new BadSubscriber()
      assert.throw(() => {
        badSubscriber.terminate()
      }, TypeError)
      resolve()
    })
  })

  it('should return an error if the implementation of ISubscriber has no method "_connection"', () => {
    return new Promise((resolve) => {
      var badSubscriber = new BadSubscriber()
      badSubscriber.connect().catch((error) => {
        assert.throw(() => {
          throw error
        }, TypeError)
        resolve()
      })
    })
  })
})
