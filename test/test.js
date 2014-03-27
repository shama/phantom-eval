var phantomEval = require('../')
var tape = require('tape')
var http = require('http')
var st = require('st')
var path = require('path')

var port = 1337
var url = 'http://localhost:' + port + '/'
var server

var count = 0
function test(name, fn) {
  count++
  tape(name, function(t) {
    t.on('end', function() {
      count--
      if (count < 1) server.close()
    })
    fn.apply(this, arguments)
  })
}

function run() {
  test('should return object', function(t) {
    t.plan(1)
    phantomEval(url, function() {
      return { test: 'thing' }
    }, function(err, data) {
      if (err) console.error(err)
      t.equal(data.test, 'thing')
    })
  })

  test('should return parsed JSON', function(t) {
    t.plan(1)
    phantomEval(url, function() {
      return JSON.stringify({ test: 'thing' })
    }, function(err, data) {
      if (err) console.error(err)
      t.equal(JSON.parse(data).test, 'thing')
    })
  })

  test('should return ember routes', function(t) {
    t.plan(1)
    phantomEval(url, function() {
      var Router = App.__container__.lookup('router:main')
      return Ember.keys(Router.router.recognizer.names)
    }, function(err, data) {
      if (err) console.error(err)
      t.deepEqual(data, ['loading', 'error', 'test', 'another', 'index'])
    })
  })

  test('should return from overly complex code', function(t) {
    t.plan(1)
    phantomEval(url, function() {
      var arr = []
      for (var i = 0; i < 10; i++) {
        arr.push(Math.random() * 255)
      }
      return String.fromCharCode.apply(null, arr).split('').map(function(n) {
        var len = function(str) {
          return str.length
        }
        return len(n)
      }).reduce(function(a, b) {
        return a + b
      }, 0)
    }, function(err, data) {
      if (err) console.error(err)
      t.equal(data, 10)
    })
  })

  test('should return window.location.href', function(t) {
    t.plan(1)
    phantomEval(url, function() {
      return window.location.href
    }, function(err, data) {
      if (err) console.error(err)
      t.equal(data, url)
    })
  })
}

// Start server then run tests
server = http.createServer(
  st({
    path: path.resolve(__dirname),
    cache: false,
    index: 'index.html'
  })
).listen(port)
server.on('listening', function() {
  console.log('Listening on ' + port + ', now running tests...')
  run()
})
