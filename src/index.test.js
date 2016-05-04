import test from 'tape'

import { myModule } from './index'

test('myModule()', (assert) => {
  assert.equal(myModule(), 'memoize-async', 'should return module name')
  assert.end()
})
