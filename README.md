# phantom-eval

> Evaluate code on a URL with PhantomJS

## Usage

``` js
var phantomEval = require('phantom-eval')

phantomEval('http://localhost:8000', function() {
  // Run this in webkit
  return window.location.href
}, function(err, results) {
  // Handle the results in node.js
  console.log(results)
})
```

Or maybe you want to write a JSON file of all the Ember routes http://emberjs.com uses?

``` js
var phantomEval = require('phantom-eval')
var fs = require('fs')
phantomEval('http://emberjs.com/', function() {
  var view = Ember.View.views[Ember.keys(Ember.View.views)[0]]
  var Router = view.container.lookup('router:main')
  return Ember.keys(Router.router.recognizer.names)
}, function(err, data) {
  fs.writeFileSync('routes.json', JSON.stringify({ routes: data }, null, 2))
  // Writes { "routes": [ "loading", "error", "index" ] }
})
```

## Release History

* 0.1.0 - initial release

## License
Copyright (c) 2014 Kyle Robinson Young  
Licensed under the MIT license.
