const bent = require('bent')
const path = require('path')
const { promisify } = require('util')
const { createReadStream } = require('fs')
const { stat, readFile, writeFile } = require('fs').promises
const jsonstream = require('jsonstream2')
const getEvents = bent('https://media.githubusercontent.com/media/mikeal/gharchive-minimized/master/')
const getLangs = bent('https://media.githubusercontent.com/media/mikeal/gharchive-languages/master/', 'buffer')

const { createBrotliDecompress, brotliDecompress } = require('zlib')
const debrotli = promisify(brotliDecompress)

const filepath = ts => {
  const year = ts.getUTCFullYear()
  const month = (ts.getUTCMonth() + 1).toString().padStart(2, '0')
  const day = ts.getUTCDate().toString().toString().padStart(2, '0')
  const hour = ts.getUTCHours()
  const filename = `${year}-${month}-${day}-${hour}.json.br`
  return `${year}/${month}/${day}/${filename}`
}

const defaults = { local: false, localLanguages: false, langs: false }

const getLanguages = async (hour, opts={}) => {
  opts = { ...defaults, ...opts }
  hour = new Date(hour)

  let resp
  if (!opts.localLanguages) {
    resp = await getLangs(filepath(hour))
  } else {
    const f = path.join(opts.localLanguages, filepath(hour))
    await stat(f)
    resp = await readFile(f)
  }
  const buffer = await debrotli(resp)
  return JSON.parse(buffer.toString())
}

const pull = async function * (hour, opts={}) {
  if (typeof opts === 'string') opts = { local: opts }
  opts = { ...defaults, ...opts }
  hour = new Date(hour)

  let langs
  if (opts.langs) {
    langs = await getLanguages(hour, opts)
  }

  let resp
  if (!opts.local) {
    resp = await getEvents(filepath(hour))
  } else {
    const f = path.join(opts.local, filepath(hour))
    await stat(f)
    resp = createReadStream(f)
  }
  const decompressor = resp.pipe(createBrotliDecompress())
  const reader = decompressor.pipe(jsonstream.parse())
  for await (const event of reader) {
    if (langs) {
      event.langs = langs[event.repo]
    }
    yield event
  }
}

module.exports = pull
