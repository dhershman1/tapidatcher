#! /usr/bin/env node

import minimist from 'minimist'
import tapidatcher from '../index.js'

/* Modules */
const parsedArgs = minimist(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version',
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

/* Output */
if (parsedArgs.version) {
  // Placeholder until a better json handling by ES6 imports
  // https://github.com/tc39/proposal-json-modules
  console.log('v0.1.0')
} else if (parsedArgs.help) {
  console.log(`
    Usage
      $ tapidatcher <options>

    Options
      --help, -h
        Open up this help screen

      --version, -v
        Get tapidatcher version

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
  tapidatcher(parsedArgs)
}
