var polyfills = require('./utils/polyfill.js');
var Path = require('./path.js');
var Route = require('./route.js');

var defaults = {};

var Router = function (options) {
  this.options = polyfills.object.assign({}, defaults, options || {});
  this.routes = [];

  this.add = function () {
    var path = '/';
    var callback = function () {};
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      path = args.shift();
    }
    callback = args.shift();

    this.routes.push({
      path: new Path(path),
      callback: callback
    });
  }

  this.resolve = function (path, state) {
    var pathObj = new Path(path);
    var routes = [];
    for (var i = 0; i < this.routes.length; i++) {
      var response = this.routes[i].path.compare(pathObj);
      if (response) {
        var newState = polyfills.object.assign(
          {},
          state,
          response
        );
        routes.push(new Route(response.params, this.routes[i].callback));
      }
    }
    if (this.options.processResponse) {
      var result = null;
      routes.reverse();
      for (var i = 0; i < routes.length; i++) {
        result = this.options.processResponse(routes[i], result);
      }
      return result;
    } else {
      return routes;
    }
  }
}

exports = module.exports = Router;
