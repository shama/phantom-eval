var phantomEval = require('../')
var fs = require('fs')

phantomEval('http://try.discourse.org/', function() {
  var view = Ember.View.views[Ember.keys(Ember.View.views)[0]]
  var Router = view.container.lookup('router:main')
  return Ember.keys(Router.router.recognizer.names)
}, function(err, data) {
  console.log(data)
})
