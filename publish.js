var config = require('./package.json');
var semver = require('semver');
var fs = require('fs');

config.version = semver.inc(config.version, 'patch');
fs.writeFileSync('./package.json', JSON.stringify(config, null, '  '), 'utf-8');
