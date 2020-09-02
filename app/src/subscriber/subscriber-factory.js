const EncoderFactory = require('../encoder/encoder-factory')
const pubsub = require('./gcp-subscriber')
const subscriber = { pubsub }

const SubscriberFactory = {
  create (conf) {
    if (conf === undefined) {
      conf = { subscriber: 'dummy', attributes: [] }
    }
    // Create encoder
    var encoder = EncoderFactory.create(conf)
    const SubscriberType = subscriber[conf.subscriber || 'dummy']
    return new SubscriberType(encoder, ...conf.attributes || [])
  },

  formatConfNamespace (template, namespace) {
    const SubscriberType = subscriber[template.subscriber]
    return SubscriberType.formatConfNamespace(template, namespace)
  }
}
Object.freeze(SubscriberFactory)

module.exports = SubscriberFactory
