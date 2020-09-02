const gcp = require('./gcp-encoder')

const encoders =  { gcp }

const EncoderFactory = {
  create (conf) {
    if (conf === undefined) {
      conf = { encoder: 'gcp', attributes: [] }
    }
    
    const EncoderType = encoders[conf.encoder || 'gcp']
    var encoder = new EncoderType(...conf.attributes || [])
    return encoder
  }
}
Object.freeze(EncoderFactory)

module.exports = EncoderFactory
