import test from 'tape'
import { add, subtract } from '../src/example.js'

test('add()', t => {
  t.same(add(1, 1), 2, '1 + 1 = 2')
  t.end()
})

test('subtract()', t => {
  t.same(subtract(2, 1), 1, '2 - 1 = 1')
  t.end()
})
