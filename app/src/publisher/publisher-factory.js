const EncoderFactory = require('../encoder/encoder-factory')
const pubsub = require("../publisher/gcp-publisher");
const publisher = { pubsub }

const PublisherFactory = {
  create (conf) {
    if (conf === undefined) {
      conf = { publisher: 'pubsub', attributes: [], encoder: 'gcp' }
    }
    // Create encoder
    var encoder = EncoderFactory.create(conf)
    const PublisherType = publisher[conf.publisher || 'pubsub']
    return new PublisherType(encoder, ...conf.attributes || [])
  },

  formatConfNamespace (template, namespace) {
    const PublisherType = publisher[template.publisher]
    return PublisherType.formatConfNamespace(template, namespace)
  }
}
Object.freeze(PublisherFactory)

module.exports = PublisherFactory
