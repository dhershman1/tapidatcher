import { exec } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import chokidar from 'chokidar'
import { globby } from 'globby'

/**
 * Prints the provided input to the terminal
 * @private
 * @param {Error} err An error object
 * @param {String} stdout A string to output to the terminal
 */
function print (err, stdout) {
  if (err) {
    console.error('Error in watcher', err)
  } else {
    console.log(stdout)
  }
}

/**
 * Creates a chokidar watcher object for use
 * @private
 * @param {Object} param0 The arguments object
 * @returns {Object} A chokidar watcher object
 */
function createWatcher ({ inline, src, tests }) {
  if (!inline && (!src || !tests)) {
    throw new Error('Tapidatcher requires at least the -i or the -s -t arguments')
  }

  if (inline) {
    return chokidar.watch(inline, { ignoreInitial: true })
  }

  return chokidar.watch([src, tests], { ignoreInitial: true })
}

/**
 * Checks to see if a value provided is within our list of ignored paths/names
 * @private
 * @param {Set} ignored A set of ignored values
 * @returns {Function} A function that uses the provided list to check for ignored values
 */
function checkIgnored (ignored) {
  return (str, parsed) => ignored.has(parsed.dir) || ignored.has(str) || ignored.has(parsed.base)
}

/**
 * Tries it's best to search the tests directory to try and find a test
 * @private
 * @param {Object} param0 A parsed path object
 * @param {Object} param1 The arguments object
 * @returns {String} A path string
 */
async function findTest ({ dir, base, name }, { tests, src, ending }) {
  if (dir === tests) {
    return path.join(dir, base)
  }

  return (await globby(tests))
    .find(l => l === path.join(dir, base) || l === path.join(dir.replace(src, tests), `${name}${ending}`))
}

/**
 * Creates a file name string based on arguments passed in
 * @private
 * @param {Object} parsed A path object of a parsed route
 * @param {String} ending The set ending desired
 * @returns {String} The newly created filename string
 */
function formatFileName (parsed, ending) {
  if (parsed.base.includes(ending)) {
    return parsed.base
  }

  return `${parsed.name}${ending}`
}

/**
 * Creates a intelligent watcher for tape tests
 * @public
 * @param {Object} args The arguments object from the terminal command
 */
function tapidatcher (args) {
  const watcher = createWatcher(args)
  const isIgnored = checkIgnored(new Set(['node_modules'].concat(args.ignore)))
  const envVars = args.env || ''

  // Run the tests initially:
  if (args.initial) {
    exec(`${envVars} ${args.cmd}`, print)
  }

  // Turn on the watcher to listen for changes in the app
  watcher.on('all', async (_, loc) => {
    const parsed = path.parse(loc)
    const { dir } = parsed
    const fileName = formatFileName(parsed, args.ending)
    let filePath = loc

    if (isIgnored(loc, parsed)) {
      return
    }

    if (args.inline) {
      filePath = path.join(dir, fileName)
    } else {
      filePath = await findTest(parsed, args)
    }

    fs.stat(filePath)
      .then(() => exec(`${envVars} npx -c "tape ${filePath}${args.pipe ? ` | ${args.pipe}` : ''}"`, print))
      .catch((err) => {
        console.error(err)
        console.log('No test file found.')
        console.log(loc)
        console.log(filePath)
      })
  })
}

export default tapidatcher
