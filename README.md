# Tapidatcher

I plan on tapidatcher becoming an intelligent watcher for tape tests, similar to something like jests watcher.

Right now I'm working off a very static and simple watcher I built for my own use cases, I need to make it more dynamic so that it fits more projects accordingly.

## Arguments

- `-t, --tests`: The location of your tests folder (if one exists) this is passed directly to [chokidar](https://github.com/paulmillr/chokidar) so any of the methods used in the string can be applied here
  - Example: `tapidatcher -t tests`
- `-s, --src`: The location of your src file (if needed) this is passed directly to [chokidar](https://github.com/paulmillr/chokidar) so any of the methods used in the string can be applied here
  - Example: `tapidatcher -s src`
- `-c, --cmd`: The command that should **initially** be ran on startup
  - Example: `tapidatcher -c 'npm t'`
- `-i, --inline`: Tells tapidatcher where to find your code and that your tests are within the same folder as your source code
  - Example: `tapidatcher -i src`
- `-e, --ending`: The file name ending used so tapidatcher can tell the difference between tests and source code
  - This is only required if you are using the `-i` argument
  - Defaults to `.spec.js` if not set
  - Example: `tapidatcher -e '.unit.js'`
- `-p, --pipe`: Tell tapidatcher the pipe command you want to run after tape runs
  - Example: `tapidatcher -p 'tap-on -u'`
- `-n, --env`: Give a list of env setters to prepend to your test command
  - Example: `tapidatcher -n 'FORCE_COLOR=1'`
- `-f, --initial`: Tells tapidatcher to run the initial tests command
  - Example: `tapidatcher -f`
- `-x, --ignore`: Files/folders you want tapidatcher to ignore

> **Important**: You must either use `-i` or `-s -t` or tapidatcher will have no idea how to watch your project!

## Notes

When searching for a test, tapidatcher will attempt to check if the file changed has a corrosponding test name, if the source file name is something like `index.js` then tapidatcher will attempt to use the folder name of that file as the test name.

I'll fill the rest of this out eventually
