#!/usr/bin/env node
const pull = require('./')

const runHour = async argv => {
  for await (const event of pull(argv.hour, argv)) {
    console.log(event)
  }
}

const options = yargs => {
  yargs.positional('hour', {
    desc: 'Hour you want to pull'
  })
  yargs.option('langs', {
    desc: 'Include language data',
    default: true
  })
}

const yargs = require('yargs')
const args = yargs
  .command('pull [hour]', 'Pull and print an hour of data', options, runHour)
  .argv

if (!args._.length) {
  yargs.showHelp()
}
