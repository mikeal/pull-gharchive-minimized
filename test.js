const assert = require('assert')
const pull = require('./')
const onehour = 1000 * 60 * 60
const run = async () => {
  let i = 0
  for await (const o of pull(Date.now() - (onehour * 50))) {
    i++
  }
  assert.ok(i > 3000) // not the best test
}
run()
