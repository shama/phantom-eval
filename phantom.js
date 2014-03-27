var system = require('system')
var page = require('webpage').create()
var fn;
var key = system.args[3]

try {
  fn = system.args[2].toString().replace(/^"|"$/g, '').replace(/\\n|\\r\\n/g, '\n')
  fn = new Function(fn)
} catch (err) {
  console.error(new Error('Function supplied had a parse error: ' + err.message))
}

page.onConsoleMessage = function(message) {
  console.log(message)
}

page.open(system.args[1], function(status) {
  var results = page.evaluate(function(fn) {
    return fn()
  }, fn)
  console.log(key)
  console.log(JSON.stringify(results))
  console.log(key)
  phantom.exit()
})