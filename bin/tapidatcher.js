#! /usr/bin/env node

import fs from 'fs/promises'
import minimist from 'minimist'
import tapidatcher from '../index.js'

/* Modules */
const parsedArgs = minimist(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version',
    c: 'config',
    a: 'assume',
    t: 'tests',
    s: 'src',
    r: 'require',
    i: 'initial',
    n: 'env',
    p: 'pipe',
    e: 'ending',
    x: 'ignore'
  },
  default: {
    e: '.js',
    n: ''
  }
})

function formatArguments (args) {
  const splittable = ['r', 'require', 'n', 'env', 'p', 'pipe', 'x', 'ignore']

  splittable.forEach(k => {
    if (args[k]) {
      args[k] = args[k].split(',')
    }
  })

  return args
}

function startup (args) {
  if (args.config) {
    const configPath = typeof args.config === 'string' ? args.config : 'tapidatcher.json'

    fs.readFile(configPath)
      .then(data => {
        let config = JSON.parse(data)

        if (/package\.json/g.test(configPath)) {
          config = config.tapidatcher
        }

        config.env = Object.entries(config.env).map(([k, val]) => `${k}=${val}`)

        console.log(config)
        tapidatcher(config)
      })
      .catch(err => {
        throw err
      })
  } else {
    const config = formatArguments(args)

    tapidatcher(config)
  }
}

/* Output */
if (parsedArgs.version) {
  // Placeholder until a better json handling by ES6 imports
  // https://github.com/tc39/proposal-json-modules
  fs.readFile('./package.json')
    .then(data => {
      const { version } = JSON.parse(data)

      console.log(version)
    })
    .catch(err => {
      throw err
    })
} else if (parsedArgs.help) {
  console.log(`
    Usage
      $ tapidatcher <options>

    Options
      --help, -h
        Open up this help screen

      --version, -v
        Get tapidatcher version

      --config, -c
        Tell tapidatcher to use a config file (defaults to tapidatcher.json)

      --assume, -a
        Automatically assumes if a file changed is named index that it sould use the folder name of this file

      --tests, -t
        The location of your tests folder (if one exists) this is passed directly to chokidar so any of the methods used in the string can be applied here

      --src, -s
        The location of your src file (if needed) this is passed directly to chokidar so any of the methods used in the string can be applied here

      --require, -r
        Tell tapidatcher to use requires with tape, similar to tape - r

      --initial, -i
        Tells tapidatcher to run the initial tests command

      --env, -n
        Give a list of env setters to prepend to your test command

      --pipe, -p
        Tell tapidatcher the pipe command you want to run after tape runs

      --ending, -e
        The file name ending used so tapidatcher can tell the difference between tests and source code (only required if using -i argument) Default: '.js'

      --ignore, -x
        Files/folders you want tapidatcher to ignore

    Examples
      tapidatcher -a -s examples/basic/src -t examples/basic/tests -n 'FORCE_COLOR=1' -p 'tap-on -s' -e .spec.js
      tapidatcher -i examples/inline -n 'FORCE_COLOR=1' -p 'tap-on' -e .spec.js
  `)
} else {
  startup(parsedArgs)
}
