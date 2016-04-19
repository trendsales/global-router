var polyfills = require('./utils/polyfill.js');
var Path = require('./path.js');
var Route = require('./route.js');

var defaults = {};

function Router(options) {
  this.options = polyfills.object.assign({}, defaults, options || {});
  this.routes = [];

  this.add = function add() {
    var path = '/';
    var callback = function callback() {};
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

  this.subtract = function subtract(newPath) {
    return newPath;
    // TODO: Remove the known path part if possible
    // and return new path object
    // else return false
  };

  this.resolve = function resolve(path, state) {
    var pathObj = typeof path === 'string'
      ? new Path(path)
      : path;
    var routes = [];
    for (var i = 0; i < this.routes.length; i++) {
      if (this.routes[i].callback instanceof Router) {
        var newPath = pathObj.subtract(this);
        if (newPath) {
          var newRoutes = this.routes[i].resolve(newPath, state);
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
          routes.push(new Route(newState, this.routes[i].callback));
        }
      }
    }
    if (this.options.processResponse) {
      var result = null;
      routes.reverse();
      for (var c = 0; c < routes.length; c++) {
        result = this.options.processResponse(routes[c], result);
      }
      return result;
    }

    return routes;
  };
}

exports = module.exports = Router;
