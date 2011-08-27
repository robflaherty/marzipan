{spawn, exec} = require 'child_process'

task 'assets:watch', 'Watch source files and build JS & CSS', (options) ->
  runCommand = (name, args...) ->
    proc =           spawn name, args
    proc.stderr.on   'data', (buffer) -> console.log buffer.toString()
    proc.stdout.on   'data', (buffer) -> console.log buffer.toString()
    proc.on          'exit', (status) -> process.exit(1) if status isnt 0
  
  runCommand 'coffee', '-wc', 'client/'
  runCommand 'coffee', '-wc', 'lib/'
  runCommand 'coffee', '-wc', 'server.coffee'
 
task 'servers:boot', 'Boot servers', (options) ->
  runCommand = (name, args...) ->
    proc =           spawn name, args
    proc.stderr.on   'data', (buffer) -> console.log buffer.toString()
    proc.stdout.on   'data', (buffer) -> console.log buffer.toString()
    proc.on          'exit', (status) -> process.exit(1) if status isnt 0
  
  runCommand 'node', 'server/build/server.js',
  runCommand 'node', 'server/dashboard/app.js' 
