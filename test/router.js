var assert = require('chai').assert;
var Router = require('../lib/index.js').Router;
var React = require('react');
var TestUtils = require('react-addons-test-utils');

describe('Router', function () {
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
    router.add('*', 'route0');
    router.add('/user*', 'route1');
    router.add('/user/*', 'route2');
    router.add('/user/:id', 'route3');
    router.add('/user/:id*', 'route4');
    router.add('/user/:id/*', 'route5');
    router.add('/user/*/images', 'route6');
    router.add('/user/:id/images', 'route7');
    router.add('/user/:id/details', 'route8');

    it('Route should be resolveable', function () {
      var routes = router.resolve('/user/1234/images');
      var mapped = routes.map(function (route) {
        return route.result;
      });
      var expected = ['route0', 'route1', 'route2', 'route4', 'route5', 'route6', 'route7'];
      assert.deepEqual(mapped, expected);
    });
  });

  describe('resolve processed route', function () {
    var router = new Router({
      processResponse: function (current, previous) {
        if (previous && previous.stopped) return previous;
        var elm = React.createElement(current.result.component);
        var actions = current.result.action ? [current.result.action] : [];
        if (previous) {
          elm = React.cloneElement(elm, null, previous.component);
          for (var i = 0; i < previous.actions.length; i++) {
            actions.push(previous.actions[i]);
          }
        }

        return {
          component: elm,
          actions: actions,
          stopped: !!current.result.stopProcessing
        };
      }
    });

    var route1 = {
      action: function () { return 'route1'; },
      component: React.createClass({
        render: function () {
          return React.createElement('div', null, ['Home', this.props.children], this.props.name);
        }
      })
    };

    var route2 = {
      action: function () { return 'route2';},
      component: React.createClass({
        render: function () {
          return React.createElement('h1', null, 'User', this.props.name);
        }
      })
    };

    it('Flatten route with children', function () {
      router.add('/user/*', route1);
      router.add('/user/:id/test', route2);
      var routes = router.resolve('/user/1234/test');
      var doc = TestUtils.renderIntoDocument(routes.component);
      var h1 = TestUtils.findRenderedDOMComponentWithTag(doc, 'h1');
      assert.equal(h1.textContent, 'User');
      assert.equal(routes.actions.length, 2);
      assert.equal(routes.actions[1](), 'route2');
    });

    it('Flatten route without children', function () {
      router.add('/user/*', route1);
      router.add('/user/:id/test', route2);
      var routes = router.resolve('/user/1234');
      var doc = TestUtils.renderIntoDocument(routes.component);
      try {
        TestUtils.findRenderedDOMComponentWithTag(doc, 'h1');
        assert.fail();
      } catch (ex) {} // eslint-disable-line no-empty
    });
  });
});
