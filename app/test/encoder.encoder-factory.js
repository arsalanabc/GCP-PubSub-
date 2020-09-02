var EncoderFactory = require('../src/encoder/encoder-factory')
var IEncoder = require('../src/encoder/encoder')
var GCPEncoder = require('../src/encoder/gcp-encoder')
var assert = require('chai').assert

describe('EncoderFactory unit tests', () => {
  it('should create a GCPEncoder if not config provided', () => {
    return new Promise((resolve) => {
      var myEncoder = EncoderFactory.create()
      assert.instanceOf(myEncoder, GCPEncoder)
      resolve()
    })
  })
  it('should generate an encoder using "create"', () => {
    return new Promise((resolve) => {
      var myEncoder = EncoderFactory.create({})
      assert.instanceOf(myEncoder, IEncoder)
      resolve()
    })
  })
})
