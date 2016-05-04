import test from 'tape'

import Cache from './cache'

test('Cache', (t) => {
  t.test('constructor()', (assert) => {
    const cache = new Cache()

    assert.true(cache._cache, 'creates internal cache object')
    assert.end()
  })

  t.test('get(key)', (assert) => {
    const cache = new Cache()

    cache.set('test', 'test')

    assert.equal(cache.get('test'), 'test', 'retrieves value for key')
    assert.end()
  })

  t.test('set(key)', (assert) => {
    const cache = new Cache()

    assert.equal(cache.get('test'), undefined, 'returns undefined if key not found')

    cache.set('test', 'test')

    assert.equal(cache.get('test'), 'test', 'sets value for key')
    assert.end()
  })

  t.test('delete(key)', (assert) => {
    const cache = new Cache()

    cache.set('test', 'test')
    cache.delete('test')

    assert.equal(cache.get('test'), undefined, 'removes specified key')

    assert.end()
  })

  t.test('clear()', (assert) => {
    const cache = new Cache()

    cache.set('test', 'test')
    cache.set('test1', 'test1')
    cache.set('test2', 'test2')
    cache.clear()

    assert.equal(cache.get('test'), undefined, 'removes all keys')
    assert.equal(cache.get('test1'), undefined, 'removes all keys')
    assert.equal(cache.get('test2'), undefined, 'removes all keys')

    assert.end()
  })
})
