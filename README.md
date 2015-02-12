# phantom-eval [![Build Status](https://travis-ci.org/shama/phantom-eval.svg)](https://travis-ci.org/shama/phantom-eval)

> Evaluate code on an URL with PhantomJS

[![NPM](https://nodei.co/npm/phantom-eval.png)](https://nodei.co/npm/phantom-eval/)

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

  // Fun way to grab the routes of any Ember app
  var view = Ember.View.views[Ember.keys(Ember.View.views)[0]]
  var Router = view.container.lookup('router:main')
  return Ember.keys(Router.router.recognizer.names).map(function(name) {
    return { name: name, url: Router.router.generate(name) }
  })

}, function(err, data) {

  fs.writeFileSync('routes.json', JSON.stringify({ routes: data }, null, 2))
  /*
    Writes the following to routes.json:
    {
      "routes": [
        {
          "name": "loading",
          "url": "/loading"
        },
        {
          "name": "error",
          "url": "/_unused_dummy_error_path_route_application/undefined"
        },
        {
          "name": "index",
          "url": "/"
        }
      ]
    }
  */

})
```

### Passing in options to phantomjs

Such as if you're behind a proxy:

``` js
var phantomEval = require('phantom-eval')
phantomEval('http://website.com', { proxy: 'http://proxyaddr.com:8080' }, function() {
  // Code to eval
}, function(err, data) {
  // Were all done
})
```

## Release History

* 1.0.0 - Support options to pass to phantomjs. Support for behind a proxy (@kauegimenes).
* 0.1.2 - Fix for semicolons and better serialization
* 0.1.1 - A better way to find the wrapping function
* 0.1.0 - initial release

## License
Copyright (c) 2014 Kyle Robinson Young  
Licensed under the MIT license.
