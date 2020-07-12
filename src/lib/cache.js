const table = new WeakMap()

// counter of the key
let counter = 0

// hashes an array of objects and returns a string
function hash(args) {
  if (!args.length) return ''
  let key = 'arg'
  for (let i = 0; i < args.length; ++i) {
    let _hash
    if (args[i] === null || typeof args[i] !== 'object') {
      // need to consider the case that args[i] is a string:
      // args[i]        _hash
      // "undefined" -> '"undefined"'
      // undefined   -> 'undefined'
      // 123         -> '123'
      // null        -> 'null'
      // "null"      -> '"null"'
      if (typeof args[i] === 'string') {
        _hash = '"' + args[i] + '"'
      } else {
        _hash = String(args[i])
      }
    } else {
      if (!table.has(args[i])) {
        _hash = counter
        table.set(args[i], counter++)
      } else {
        _hash = table.get(args[i])
      }
    }
    key += '@' + _hash
  }
  return key
}

class Cache {
  constructor(initialData = {}) {
    this.__cache = new Map(Object.entries(initialData))
  }

  get(key) {
    const [_key] = this.serializeKey(key)
    return this.__cache.get(_key)
  }

  set(key, value) {
    const [_key] = this.serializeKey(key)
    this.__cache.set(_key, value)
  }

  keys() {
    return Array.from(this.__cache.keys())
  }

  has(key) {
    const [_key] = this.serializeKey(key)
    return this.__cache.has(_key)
  }

  clear() {
    this.__cache.clear()
  }

  delete(key) {
    const [_key] = this.serializeKey(key)
    this.__cache.delete(_key)
  }

  // TODO: introduce namespace for the cache
  serializeKey(key) {
    let args = null
    if (typeof key === 'function') {
      try {
        key = key()
      } catch (err) {
        // dependencies not ready
        key = ''
      }
    }

    if (Array.isArray(key)) {
      // args array
      args = key
      key = hash(key)
    } else {
      // convert null to ''
      key = String(key || '')
    }

    const errorKey = key ? 'err@' + key : ''

    return [key, args, errorKey]
  }
}

export default new Cache()
