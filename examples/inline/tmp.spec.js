import test from 'tape'
import { add, subtract } from './tmp.js'

test('add() (unit.js)', t => {
  t.same(add(1, 1), 2, '1 + 1 = 2')
  t.end()
})

test('subtract() (unit.js)', t => {
  t.same(subtract(2, 1), 1, '2 - 1 = 1')
  t.end()
})
