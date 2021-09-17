import { exec } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import chokidar from 'chokidar'

const execP = promisify(exec)
const CLEAR = process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H'

/**
 * Prints the provided input to the terminal
 * @private
 * @param {Error} err An error object
 * @param {String} stdout A string to output to the terminal
 */
function print ({ stderr, stdout }) {
  if (stderr) {
    console.error('Error in watcher', stderr)
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
function createWatcher ({ src, tests }) {
  if (!src && !tests) {
    throw new Error('Tapidatcher requires at least the -s argument')
  }

  if (!tests) {
    return chokidar.watch([src], { ignoreInitial: true })
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
function findTest (testFileName, dir, { tests, src }) {
  const basicLoc = path.join(dir, testFileName)

  if (dir === tests) {
    return basicLoc
  }

  return path.join(dir.replace(src, tests), testFileName)
}

/**
 * Creates a file name string based on arguments passed in
 * @private
 * @param {Object} parsed A path object of a parsed route
 * @param {String} ending The set ending desired
 * @returns {String} The newly created filename string
 */
function formatFilePath (parsed, { assume, ending }) {
  if (assume && parsed.base === 'index.js') {
    const brokenDown = parsed.dir.split('/')
    const folderName = brokenDown[brokenDown.length - 1]

    return `${folderName}${ending}`
  }

  if (parsed.base.includes(ending)) {
    return parsed.base
  }

  return `${parsed.name}${ending}`
}

/**
 * Runs a super simple start message for the watcher
 * @param {Object} args The arguments object
 * @returns {Object} The created watcher and the test directories found
 */
async function startup (args) {
  // Run the tests initially:
  if (args.initial) {
    console.info('Started Initial Run...')
    console.info('Initial :>> ', `${args.env} ${args.initial}`)
    print(await execP(`${args.env} ${args.initial}`))
  }

  console.group('Watcher Started!')
  const watcher = createWatcher(args)

  if (args.tests) {
    console.info('Watching Tests:', args.tests)
  }

  if (args.src) {
    console.info('Watching Source:', args.src)
  }
  console.groupEnd('Watcher Started!')

  return watcher
}

/**
 * Creates a intelligent watcher for tape tests
 * @public
 * @param {Object} args The arguments object from the terminal command
 */
async function tapidatcher (args) {
  const watcher = await startup(args)
  const isIgnored = checkIgnored(new Set(['node_modules'].concat(args.ignore)))

  // Turn on the watcher to listen for changes in the app
  watcher.on('all', async (_, loc) => {
    process.stdout.write(CLEAR)
    const parsed = path.parse(loc)
    const fileName = formatFilePath(parsed, args)
    let filePath = loc

    if (isIgnored(loc, parsed)) {
      return
    }

    if (!args.tests) {
      filePath = path.join(parsed.dir, fileName)
    } else {
      filePath = await findTest(fileName, parsed.dir, args)
    }

    try {
      await fs.stat(filePath)
      print(await execP(`${args.env} npx -c "tape ${args.require ? `-r ${args.require} ` : ''}${filePath}${args.pipe ? ` | ${args.pipe}` : ''}"`))
    } catch (err) {
      if (err.code === 'ENOENT' && err.errno === -2) {
        console.error('No test file found.')
        console.error('Triggering File:', loc)
        console.error('Attempted Search:', filePath)
      } else {
        console.error(err)
      }
    }
  })
}

export default tapidatcher
