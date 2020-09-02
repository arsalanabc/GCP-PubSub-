/**
 * Base class to implement outgoing dataflow
 */
class IPublisher {
  constructor (_encoder) {
    if (this.constructor.name === 'IPublisher') {
      throw new TypeError('Abstract class "IPublisher" cannot be instanciated')
    }
    this.encoder = _encoder
  }
 
  static formatConfNamespace() {
    throw new TypeError('"IPublisher" sub-class must implement "formatConfNamespace" method') 
  }

  connect () {
    return new Promise(this._connection.bind(this))
  }

  _connection (resolve, reject) {
    reject(new TypeError('"IPublisher" sub-class must implement "_connection" method'))
  }

  /**
   * Publishing something will attach a promise, when the promise is fullified it means that the request is done processing
   * If resolve : The message was sent to all client
   * If reject: Something went wrong and all client didn't get the message
   * Publish method shouldn't be reimplement in sub class
   */
  publish (msg) {
    return new Promise(this._publishing.bind(this, this.encoder.encode(msg)))
  }

  /**
   * This is where you implement the publish process, use the resolve or reject to notify the premise holder of the results
   *
   * @param {*} msg
   * @param {*} resolve
   * @param {*} reject
   */
  _publishing (msg, resolve, reject) {
    reject(new TypeError('"IPublisher" sub-class must implement "_publishing" method'))
  }

  terminate () {
    throw new TypeError('"IPublisher" sub-class must implement "terminate" method')
  }
}

module.exports = IPublisher
