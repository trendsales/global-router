var Router = require('./lib/index.js').Router;

function getMicroSec() {
  var hrTime = process.hrtime();
  return (hrTime[0] * 1000000 + hrTime[1] / 1000);
}

function ops(action) {
  var startTime = getMicroSec();
  var count = 0;
  while (getMicroSec() - startTime < 1000) {
    action();
    count++;
  }
  return count;
}

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

var start = getMicroSec();
for (var i = 0; i < 100000; i++) {
  router.resolve('/user/1234/images');
}
console.log(getMicroSec() - start);
