#! /usr/bin/env node

import minimist from 'minimist'
import tapidatcher from '../index.js'

/* Modules */
const parsedArgs = minimist(process.argv.slice(2), {
  alias: {
    v: 'version',
    a: 'assume',
    t: 'tests',
    s: 'src',
    r: 'require',
    f: 'initial',
    i: 'inline',
    n: 'env',
    p: 'pipe',
    e: 'ending',
    x: 'ignore'
  },
  default: {
    e: '.js',
    c: 'tape',
    n: ''
  }
})

/* Output */
if (parsedArgs.version) {
  // Placeholder until a better json handling by ES6 imports
  // https://github.com/tc39/proposal-json-modules
  console.log('v0.1.0')
} else {
  tapidatcher(parsedArgs)
}
