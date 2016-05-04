import Cache from './cache'

function memoize(fn, keyGen) {
  if (typeof fn !== 'function' || (keyGen && typeof keyGen !== 'function')) {
    throw new Error('Expected a function.')
  }

  const cache = new Cache()

  function memoized(...params) {
    function findOrCreate(key) {
      const cached = cache.get(key)
      if (cached) return Promise.resolve(cached)
      return Promise.resolve(fn(...params))
        .then((value) => {
          cache.set(key, value)
          return value
        })
    }

    if (keyGen) {
      return Promise.resolve(keyGen(...params))
        .then((key) => findOrCreate(key))
    }

    return Promise.resolve(JSON.stringify(params))
      .catch(() => Promise.resolve(params[0]))
      .then((key) => findOrCreate(key))
  }

  memoized.cache = cache

  return memoized
}

module.exports = memoize
