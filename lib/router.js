var polyfills = require('./utils/polyfill.js');
var Path = require('./path.js');

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

  this.resolve = function (path) {
    var pathObj = new Path(path);
    var routes = [];
    for (var i = 0; i < this.routes.length; i++) {
      var response = this.routes[i].path.compare(pathObj);
      if (response) {
        response.result = this.routes[i].callback;
        routes.push(response);
      }
    }
    return routes;
  }
}

exports = module.exports = Router;
