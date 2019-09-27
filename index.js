const bent = require('bent')
const path = require('path')
const { createReadStream } = require('fs')
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

const pull = async function * (hour, local = false) {
  hour = new Date(hour)
  let resp
  if (!local) {
    resp = await get(filepath(hour))
  } else {
    resp = createReadStream(path.join(local, filepath(hour)))
  }
  const decompressor = resp.pipe(createBrotliDecompress())
  const reader = decompressor.pipe(jsonstream.parse())
  yield * reader
}

module.exports = pull
