exports.reduce = function reduce(array, func) {
  if (array.reduce) {
    return array.reduce(func, null);
  }
  var result = null;
  for (var c = 0; c < array.length; c++) {
    result = func(result, array[c], c, array);
  }
  return result;
};
