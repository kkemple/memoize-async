export default class Cache {
  constructor() {
    this._cache = {}
  }

  get(k) {
    return this._cache[k]
  }

  set(k, v) {
    this._cache[k] = v
  }

  delete(k) {
    delete this._cache[k]
  }

  clear() {
    delete this._cache
    this._cache = {}
  }
}
