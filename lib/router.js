var polyfills = require('./utils/polyfill.js');
var Path = require('./path.js');
var Route = require('./route.js');

var defaults = {};

function Router(options) {
  this.options = polyfills.object.assign({}, defaults, options || {});
  this.routes = [];

  this.add = function add() {
    var path = '/';
    var callback = null;
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      path = args.shift();
    }
    callback = args.shift();

    this.routes.push({
      path: new Path(path),
      callback: callback
    });
  };

  this.resolve = function resolve(path, state) {
    var pathObj = typeof path === 'string'
      ? new Path(path)
      : path;
    var routes = [];
    for (var i = 0; i < this.routes.length; i++) {
      if (this.routes[i].callback instanceof Router) {
        var newPath = this.routes[i].path.subtract(pathObj);
        if (newPath) {
          var newRoutes = this.routes[i].callback.resolve(newPath, state);
          for (var b = 0; b < newRoutes.length; b++) {
            routes.push(newRoutes[b]);
          }
        }
      } else {
        var response = this.routes[i].path.compare(pathObj);
        if (response) {
          var newState = polyfills.object.assign(
            {},
            state,
            response
          );
          var resolved = typeof this.routes[i].callback === 'function'
            ? this.routes[i].callback(newState)
            : this.routes[i].callback;
          routes.push(new Route(newState, resolved));
        }
      }
    }
    if (this.options.processResponse) {
      routes.reverse();
      return polyfills.array.reduce(routes, this.options.processResponse);
    }

    return routes;
  };
}

exports = module.exports = Router;
