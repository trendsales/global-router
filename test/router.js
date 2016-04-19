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

  describe('resolve route', function () {
    var router = new Router();
    var route1 = 'route1';
    var route2 = 'route2';
    var route3 = 'route3';

    it('Route should be added to router', function () {
      router.add('/user/*', route3);
      router.add('/user/:id/test', route2);
      router.add('/user/:id/images', route1);
      assert.equal(router.routes[0].callback, route3);
    });

    it('Route images should be resolveable', function () {
      var routes = router.resolve('/user/1234/images');
      assert.equal(routes[1].result, route1);
    });

    it('Route test should be resolveable', function () {
      var routes = router.resolve('/user/1234/test');
      assert.equal(routes[1].result, route2);
    });

    it('Route * should be resolveable', function () {
      var routes = router.resolve('/user/1234/test');
      assert.equal(routes[0].result, route3);
    });
  });

  describe('resolve processed route', function () {
    var router = new Router({
      processResponse: function(current, prev) {
        var response = {
          me: {
            name: current.result.name,
            child: null
          },
          actions: [current.result.action]
        };
        if (prev) {
          if (prev.actions) {
            for (var i = 0; i < prev.actions.length; i++) {
              response.actions.push(prev.actions[i]);
            }
          }
          if (prev.me) {
            if (!current.result.name) {
              response.me = prev.me;
            } else {
              response.me.child = prev.me;
            }
          }
        }
        return response;
      }
    });

    var route1 = {
      name: 'route1',
      action: 'action1'
    };
    var route2 = {
      name: 'route2',
      action: 'action2'
    };

    it('Flatten route', function () {
      router.add('/user/*', route1);
      router.add('/user/:id/test', route2);
      var routes = router.resolve('/user/1234/test');
      assert.equal(routes.actions[1], route2.action);
      assert.equal(routes.me.child.name, route2.name);
    });
  });
});
