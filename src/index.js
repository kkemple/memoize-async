import Cache from './cache'

function memoize(fn, resolver) {
  if (typeof fn !== 'function' || (resolver && typeof resolver !== 'function')) {
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

    if (resolver) {
      return Promise.resolve(resolver(...params))
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
