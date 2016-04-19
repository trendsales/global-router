var Parameter = require('./parameter.js');

function clean(array, deleteValue) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == deleteValue) {
      array.splice(i, 1);
      i--;
    }
  }
  return array;
};

var Path = function(path) {
  this.elements = path ? clean(path.split('/'), '') : [];
  for (var i = 0; i < this.elements.length; i++) {
    if (this.elements[i].charAt(0) === ':') {
      this.elements[i] = new Parameter(this.elements[i].substring(1));
    }
  }

  this.compare = function(newPath) {
    var response = {
      params: {},
      result: null,
    };
    var usingWildcard = false;
    var currentPath = 0;
    for (var i = 0; i < newPath.elements.length + 1; i++) {
      if (this.elements[currentPath] instanceof Parameter) {
        response.params[this.elements[currentPath].name] = newPath.elements[i];
        currentPath++;
      } else if (usingWildcard && this.elements[currentPath + 1] === newPath.elements[i]) {
        usingWildcard = false;
        currentPath++;
        i--;
      } else if (this.elements[currentPath] === '*') {
        usingWildcard = true;
      } else if (!usingWildcard && this.elements[currentPath] !== newPath.elements[i]) {
        return false;
      } else {
        if (!usingWildcard) {
          currentPath++;
        }
      }
    }
    if (currentPath < this.elements.length) {
      return false;
    }
    return response;
  }
}

exports = module.exports = Path;
