const bent = require('bent')
const jsonstream = require('jsonstream2')
const get = bent('https://media.githubusercontent.com/media/mikeal/gharchive-minimized/master/')

const { createBrotliDecompress } = require('zlib')

const filepath = ts => {
  const year = ts.getUTCFullYear()
  const month = (ts.getUTCMonth() + 1).toString().padStart(2, '0')
  const day = ts.getUTCDate().toString().toString().padStart(2, '0')
  const hour = ts.getUTCHours()
  const filename = `${year}-${month}-${day}-${hour}.json.br`
  return `${year}/${month}/${day}/${filename}`
}

const pull = async function * (hour) {
  hour = new Date(hour)
  const resp = await get(filepath(hour))
  const decompressor = resp.pipe(createBrotliDecompress())
  const reader = decompressor.pipe(jsonstream.parse())
  yield * reader
}

module.exports = pull
