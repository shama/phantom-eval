var path = require('path')
var binPath = require('phantomjs').path
var falafel = require('falafel')
var execFile = require('child_process').execFile
var dargs = require('dargs')

module.exports = function(url, opts, fn, done) {
  if (typeof opts === 'function') {
    done = fn
    fn = opts
    opts = {}
  }
  var script = path.join(__dirname, 'phantom.js')
  var key = '--- ' + +Date.now() + ' ---'

  function isWrapper(node) {
    return (
      node.type === 'FunctionExpression' &&
      node.parent &&
      Array.isArray(node.parent.arguments) &&
      node.parent.arguments[0].value === key
    )
  }

  if (typeof fn === 'function') {
    var output = ''
    falafel('(' + fn + '("' + key + '"))', function(node) {
      // Pull out the contents of the surrounding body function
      if (isWrapper(node)) {
        for (var i = 0; i < node.body.body.length; i++) {
          output += node.body.body[i].source()
        }
      }
    })
    fn = output
  }
  
  // Serialize and run phantomjs
  fn = JSON.stringify(fn.toString())
  var args = dargs(opts).concat([script, url, fn, key])
  execFile(binPath, args, function(err, stdout, stderr) {
    if (err || stderr) return done(err || new Error(stderr), null, stdout)
    var data = stdout.split(key).slice(1, -1).join('').replace(/\n|\r\n/g, '')
    try {
      data = JSON.parse(data)
    } catch (err) {
      return done(new Error('Failed to parse the response from phantomjs ' + err.message), null, stdout)
    }
    return done(null, data, stdout)
  })
}
