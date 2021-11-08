# Tapidatcher

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

Tapidatcher uses [chokidar](https://github.com/paulmillr/chokidar) to watch over source and test file systems, so you can run tests with tape while you write code!

> [Tape](https://github.com/substack/tape) is included as a dependency, so you only need to use tapidatcher when running tests

## Why?

I used [Jest](https://github.com/facebook/jest) a little bit recently, and found that I did enjoy their test watcher setup quite a bit. I prefer to use tape for all my testing needs, but lacked this functionality, so I decided to take a stab at it myself!

## Arguments

- `-v, --version`: Display the current tapidatcher version
- `-h, --help`: Displays some helpful text for the cli
- `-c, --config`: Use a config json instead of arguments
  - Defaults to `tapidatcher.json`
  - Example: `tapidatcher -c tapi.config.json`
- `-t, --tests`: The location of your tests folder (if one exists) this is passed directly to [chokidar](https://github.com/paulmillr/chokidar) so any of the methods used in the string can be applied here
  - Example: `tapidatcher -t tests`
- `-a, --assume`: Automatically assumes if a file changed is named `index` that it sould use the folder name of this file
  - Example: `tapidatcher -a`
- `-s, --src`: The location of your src file (if needed) this is passed directly to [chokidar](https://github.com/paulmillr/chokidar) so any of the methods used in the string can be applied here
  - Example: `tapidatcher -s src`
- `-r, --require`: Tell tapidatcher to use requires with tape, similar to `tape -r`
  - Example: `tapidatcher -r esm`
  - If using more than one require value split them with commas `-r 'esm,something'`
- `-e, --ending`: The file name ending used so tapidatcher can tell the difference between tests and source code
  - This is only required if you are using the `-i` argument
  - Defaults to `.js` if not set
  - Example: `tapidatcher -e '.unit.js'`
- `-p, --pipe`: Tell tapidatcher the pipe command you want to run after tape runs
  - Example: `tapidatcher -p 'tap-on -u'`
  - If using more than one pipe value split them with commas `-p 'tap-on -u,something -else'`
- `-n, --env`: Give a list of env setters to prepend to your test command
  - Example: `tapidatcher -n 'FORCE_COLOR=1'`
  - If using more than one env value split them with commas `-n 'FORCE_COLOR=1,ENV=test'`
- `-i, --initial`: Tells tapidatcher to run the initial tests command
  - Example: `tapidatcher -i 'npm t'`
- `-x, --ignore`: Files/folders you want tapidatcher to ignore
  - Example: `tapidatcher -x 'example.unit.js'`
  - If using more than one env value split them with commas `-x 'example.unit.js,examples/ignored'`,

> **Important**: You must at least provide a source argument to wath (`-s, --src`)

If you don't provide the tests argument (`-t, --tests`) then Tapidatcher will assume all of your tests are inline and watch accordingly

## Usage

When searching for a test, tapidatcher will attempt to check if the file changed has a corrosponding test name, if the source file name is something like `index.js` and you have the `--assume` argument set, then tapidatcher will attempt to use the folder name of that file as the test name.

You can use tapidatcher with the arguments, or with a json config. My suggestion is, if you have a lot of ignores/requires/etc then you use the config setup. Argument exists for simple and quick runs

Tapiatcher can be used like any other cli tool

```cli
$ tapidatcher -a -s examples/basic/src -t examples/basic/tests -n 'FORCE_COLOR=1' -p 'tap-on -s' -e .spec.js

$ tapidatcher -i examples/inline -n 'FORCE_COLOR=1' -p 'tap-on' -e .spec.js

$ tapidatcher -s examples/inline -x 'tmp.spec.js,examples/basic' -n 'FORCE_COLOR=1' -p 'tap-on' -e .spec.js
```

### Using a config.json

Optionally instead of arguments you can use a config json to pass your setup to tapidatcher instead

> **NOTE** using a config will **IGNORE** arguments passed via cli, you should put **all** of the settings in your json

Config types:

- `tests`: `String`
- `src`: `String`
- `ending`: `String`
- `ignore`: `String[]`
- `assum`: `Boolean`
- `pipe`: `String[]`
- `initial`: `String`
- `require`: `String[]`
- `env`: `Object`
  - `{ name<String>: value<Any> }`

Example config:

```json
{
  "tests": "examples/basic/src",
  "src": "examples/basic/src",
  "ending": ".spec.js",
  "ignore": ["example.unit.js", "examples/ignored"],
  "assume": true,
  "pipe": ["tap-on -s"],
  "initial": "npm t",
  "require": ["esm"],
  "env": {
    "FORCE_COLOR": 1
  }
}
```

### Using package.json

Alternatively you can put your tapidatcher settings into your `package.json` under the `tapidatcher` key.

The layout is exactly the same as if you were using the `config` setup.

Example:

```json
{
  "name": "basic",
  "version": "1.0.0",
  "scripts": {
    "test": ""
  },
  "tapidatcher": {
    "tests": "basic/src",
    "src": "basic/src",
    "ending": ".spec.js",
    "ignore": [
      "example.unit.js",
      "ignored"
    ],
    "assume": true,
    "pipe": [
      "tap-on -s"
    ],
    "initial": "npm run initial",
    "require": [
      "esm"
    ],
    "env": {
      "FORCE_COLOR": 1
    }
  }
}
```
