var assert = require('chai').assert;
var Router = require('../lib/index.js').Router;

describe('Router', function() {
  describe('constructor without options', function () {
    it('should return object', function () {
      var router = new Router();
      assert.typeOf(router, 'object');
    });
  });

  describe('constructor options', function () {
    it('should return object', function () {
      var router = new Router({
        test: 'hello'
      });
      assert.typeOf(router, 'object');
    });
  });

  describe('add simple route', function () {
    var router = new Router();
    var route = {
      action: null,
      component: null
    };

    it('Route should be added to router', function () {
      router.add('/user/:id/images', route);
      assert.equal(router.routes[0].callback, route);
    });

    it('Route should be resolveable', function () {
      var routes = router.resolve('/user/1234/images');
      assert.equal(routes[0].result, route);
    });
  });
});
