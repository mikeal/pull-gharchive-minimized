const assert = require('assert')
const path = require('path')
const pull = require('../')
const onehour = 1000 * 60 * 60
const run = async () => {
  let i = 0
  for await (const o of pull(Date.now() - (onehour * 50))) {
    i++
  }
  assert.ok(i > 3000) // not the best test

  i = 0
  const local = path.join(__dirname, 'fixtures')
  for await (const o of pull(new Date('2019-09-26'), local)) {
    i++
  }
  assert.strictEqual(i, 62952)
}

run()
