
function getMicroSec() {
  var hrTime = process.hrtime();
  return (hrTime[0] * 1000000 + hrTime[1] / 1000);
}

exports = module.exports = function ops(action) {
  var startTime = getMicroSec();
  var count = 0;
  while (getMicroSec() - startTime < 1000 * 100) {
    action();
    count++;
  }
  return count * 10;
};
