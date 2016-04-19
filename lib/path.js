var Parameter = require('./parameter.js');

function clean(array, deleteValue) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === deleteValue) {
      array.splice(i, 1);
      i--;
    }
  }
  return array;
}

function Path(path) {
  var i;

  this.elements = path ? clean(path.split('/'), '') : [];
  for (i = 0; i < this.elements.length; i++) {
    if (this.elements[i].charAt(0) === ':') {
      var name = this.elements[i].substring(1);
      if (this.elements[i].slice(-1) === '*') {
        name = name.slice(0, -1);
        this.elements[i] = new Parameter(name, true);
      } else {
        this.elements[i] = new Parameter(name);
      }
    }
  }

  this.compare = function compare(newPath) {
    var response = {
      params: {},
      result: null
    };
    var usingWildcard = false;
    var currentPath = 0;
    for (i = 0; i < newPath.elements.length + 1; i++) {
      if (this.elements[currentPath] instanceof Parameter) {
        response.params[this.elements[currentPath].name] = newPath.elements[i];
        if (this.elements[currentPath].partial) {
          return response;
        }
        currentPath++;
      } else if (usingWildcard && this.elements[currentPath + 1] === newPath.elements[i]) {
        usingWildcard = false;
        currentPath++;
        i--;
      } else if (this.elements[currentPath] === '*') {
        usingWildcard = true;
      } else if (!usingWildcard && this.elements[currentPath] !== newPath.elements[i]) {
        if (this.elements[currentPath] && this.elements[currentPath].slice(-1) === '*') {
          if (this.elements[currentPath].slice(0, -1) === newPath.elements[i]) {
            return response;
          }
        }
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
  };

  this.toString = function toString() {
    return '/' + this.elements.join('/');
  };
}

exports = module.exports = Path;
