var path = require('path')
var binPath = require('phantomjs').path
var falafel = require('falafel')
var execFile = require('child_process').execFile

module.exports = function(url, fn, done) {
  var script = path.join(__dirname, 'phantom.js')
  var key = '--- ' + +Date.now() + ' ---'

  if (typeof fn === 'function') {
    var first = true
    var output = ''
    falafel('(' + fn + '())', function(node) {
      // Pull out the contents of the surrounding body function
      if (first === true && node.type === 'FunctionExpression') {
        for (var i = 0; i < node.body.body.length; i++) {
          output += node.body.body[i].source()
        }
        first = false
      }
    })
    fn = output
  }
  
  // Serialize and run phantomjs
  fn = JSON.stringify(fn.toString().replace(/\n|\r\n/g, ';'))
  execFile(binPath, [script, url, fn, key], function(err, stdout, stderr) {
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
