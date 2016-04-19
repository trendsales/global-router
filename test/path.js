var assert = require('chai').assert;
var Path = require('../lib/index.js').Path;

describe('Path', function() {
  describe('constructor', function () {
    it('without object', function () {
      var path = new Path();
      assert.typeOf(path, 'object');
    });

    it('with options', function () {
      var path = new Path('/hello/world/and///stuff/');
      assert.deepEqual(path.elements, [ 'hello', 'world', 'and', 'stuff' ]);
    });
  });

  describe('compare paths', function () {
    var path1 = new Path('/hello/world/and///stuff/');

    it('compare equal paths', function () {
      var path2 = new Path('/hello/world/and///stuff/');
      assert.typeOf(path1.compare(path2), 'object');
    });

    it('compare unequal paths', function () {
      var path2 = new Path('/hello/sdf/and///stuff/');
      assert.isFalse(path1.compare(path2));
    });


    it('compare shorter path', function () {
      var path2 = new Path('/hello/world/and///');
      assert.isFalse(path1.compare(path2));
    });

    it('compare logner path', function () {
      var path2 = new Path('/hello/world/and///stuff/more');
      assert.isFalse(path1.compare(path2));
    });
  });

  describe('Using paramertized path', function () {
    it('Identical paramatizes paths', function () {
      var path1 = new Path('/user/:id/images');
      var path2 = new Path('/user/1234/images');
      var compare = path1.compare(path2);
      assert.typeOf(compare, 'object');
      assert.equal(compare.params.id, 1234);
    });

    it('Different paramatizes paths', function () {
      var path1 = new Path('/user/:id/test');
      var path2 = new Path('/user/1234/images');
      var compare = path1.compare(path2);
      assert.isFalse(compare);
    });
  });

  describe('Using wildcard path', function () {
    it('shorter level wildcard', function () {
      var path1 = new Path('//*/images');
      var path2 = new Path('/user/1234/images');
      var compare = path1.compare(path2);
      assert.typeOf(compare, 'object');
    });

    it('Same level wildcard', function () {
      var path1 = new Path('/user/*/images');
      var path2 = new Path('/user/1234/images');
      var compare = path1.compare(path2);
      assert.typeOf(compare, 'object');
    });

    it('Same level invalid wildcard', function () {
      var path1 = new Path('/user/*/test');
      var path2 = new Path('/user/1234/images');
      var compare = path1.compare(path2);
      assert.isFalse(compare);
    });

    it('Multilevel wildcard', function () {
      var path1 = new Path('/user/*');
      var path2 = new Path('/user/1234/images');
      var compare = path1.compare(path2);
      assert.typeOf(compare, 'object');
    });
  });
});
