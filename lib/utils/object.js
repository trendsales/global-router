exports.assign = function assign(target) {
  'use strict';

  /* if (Object.assign) { // commented out as test shows this as slower
    return Object.assign.apply(this, arguments);
  }*/

  var output = Object(target);
  for (var index = 1; index < arguments.length; index++) {
    var source = arguments[index];
    if (source !== undefined && source !== null) {
      for (var nextKey in source) {
        if (source.hasOwnProperty(nextKey)) {
          output[nextKey] = source[nextKey];
        }
      }
    }
  }
  return output;
};
