import test from 'tape'
import sinon from 'sinon'

import memoize from './index'

test('memoize-async', (t) => {
  t.test('exports a function', (assert) => {
    assert.equal(typeof memoize, 'function', 'should export a function')
    assert.end()
  })

  t.test('expects a function as first parameter', (assert) => {
    try {
      memoize()
    } catch (err) {
      assert.equal(
        err.message,
        'Expected a function.',
        'should throw error if first parameter is not a function'
      )
    }

    try {
      memoize(1)
    } catch (err) {
      assert.equal(
        err.message,
        'Expected a function.',
        'should throw error if first parameter is not a function'
      )
    }

    try {
      memoize('test')
    } catch (err) {
      assert.equal(
        err.message,
        'Expected a function.',
        'should throw error if first parameter is not a function'
      )
    }

    assert.end()
  })

  t.test('expects a function as second parameter (if provided)', (assert) => {
    try {
      memoize(() => {}, 1)
    } catch (err) {
      assert.equal(
        err.message,
        'Expected a function.',
        'should throw error if second parameter is not a function'
      )
    }

    try {
      memoize(() => {}, 'hey')
    } catch (err) {
      assert.equal(
        err.message,
        'Expected a function.',
        'should throw error if second parameter is not a function'
      )
    }

    assert.end()
  })

  t.test('memoize should return a function', (assert) => {
    assert.equal(typeof memoize((a) => a * a), 'function', 'should return a function')
    assert.end()
  })

  t.test('memoized functions should return promises', (assert) => {
    const multiply = memoize((a) => a * a)
    const promise = multiply(2)

    assert.equal(promise instanceof Promise, true, 'memoized method returns a promise')
    assert.end()
  })

  t.test('if no cache entry is found, memoize should call fn and update cache', (assert) => {
    const func = sinon.stub().returns(Promise.resolve('test'))
    const mem = memoize(func)

    let first
    let second
    mem(2).then((val) => { first = val })
      .then(() => mem(2).then((val) => { second = val }))
      .then(() => {
        assert.equal(func.calledOnce, true, 'fn called only once')
        assert.equal(first, second, 'returns proper cached value')
        assert.end()
      })
  })

  t.test('resolver is given arguments to fn', (assert) => {
    const func = () => {}
    const resolver = sinon.spy()
    const noop = () => {}

    const mem = memoize(func, resolver)
    mem(1, 2, noop).then(() => {
      assert.equal(resolver.calledWith(1, 2, noop), true, 'resolver is called with fn params')
      assert.end()
    })
  })

  t.test('resolver methods can be async', (assert) => {
    const func = (a) => new Promise((res) => setTimeout(() => res(a), 10))
    const resolver = (a) => new Promise((res) => setTimeout(() => res(a), 10))

    const mem = memoize(func, resolver)
    mem(2).then((a) => {
      assert.equal(a, 2, 'resolver works asynchronously')
      assert.end()
    })
  })
})
