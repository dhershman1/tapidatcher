const test = require('tape')
const { add, subtract } = require('./example')

test('add() (unit.js)', t => {
  t.same(add(1, 1), 2, '1 + 1 = 2')
})

test('subtract() (unit.js)', t => {
  t.same(subtract(2, 1), '2 - 1 = 1')
})
