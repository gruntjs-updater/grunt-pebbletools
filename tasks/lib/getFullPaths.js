var fs = require('fs');
var p = require('path');

var topDir = process.cwd();

'use strict';

module.exports = function(projectDir, config) {
  var ret = [];
  if (config.imports) {
    for (var i = 0; i < config.imports.length; i++) {
      var importLibName = config.imports[i];
      var importLibPath = p.join(topDir, importLibName);
      var s = fs.readFileSync(p.join(importLibPath, "config.json"));
      var importLib = JSON.parse(s.toString());
      for (var j = 0; j < importLib.list.length; j++) {
        var file = importLib.list[j];
        if (file.indexOf("app") !== 0) {
          ret.push(p.join(importLibPath, file));
        }
      }
    }
  }
  for (var k = 0; k < config.list.length; k++) {
    var file = config.list[k];
    if (file.indexOf("app") !== 0) {
      ret.push(p.join(projectDir, file));
    }
  }
  return ret;

};



