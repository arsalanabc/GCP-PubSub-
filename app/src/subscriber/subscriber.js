/**
 * Base class to implement incoming data flow
 */
class ISubscriber {
  constructor (_encoder) {
    this.rcvCallback = null
    this.conCallback = null
    if (this.constructor.name === 'ISubscriber') {
      throw new TypeError('Abstract class "ISubscriber" cannot be instanciated')
    }
    this.encoder = _encoder
  }

  static formatConfNamespace() {
    throw new TypeError('"ISubscriber" sub-class must implement "formatConfNamespace" method') 
  }

  connect () {
    return new Promise(this._connection.bind(this))
  }

  _connection (resolve, reject) {
    reject(new TypeError('"ISubscriber" sub-class must implement "_connection" method'))
  }

  /**
     * Attach a callback triggered on message receive
     * @param {*} callback
     */
  onReceive (callback) {
    this.rcvCallback = callback
  }

  _executeReceiveCallback (msg) {
    typeof this.rcvCallback === 'function' && this.rcvCallback(this.encoder.decode(msg))
  }

  terminate () {
    throw new TypeError('"ISubscriber" sub-class must implement "terminate" method')
  }
}

module.exports = ISubscriber
