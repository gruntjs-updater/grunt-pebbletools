var fs = require('fs');
var p = require('path');
var getPageObject = require('pebble-utils').getPageObject;

'use strict';

function interpolate(s, o) {
  for (var key in o) {
    s = s.replace(new RegExp('{{{' + key + '}}}', 'g'), o[key]);
  }
  return s;
}

module.exports = function(gruntRef, data) {
  grunt = gruntRef;

  var list = fs.readdirSync(data.viewsPath); 

  list.forEach(function(file) {

    if (file.indexOf('.swp') == -1) {
      var s = fs.readFileSync(p.join(data.viewsPath, file), 'utf8');
      var configStr = fs.readFileSync(p.join(data.configsPath,  file.replace('.html','') + '.json'), 'utf8');
      var config = JSON.parse(configStr);
      s = interpolate(s, getPageObject(config, 'backbonejs'));
      console.log('writing ...' + file);
      fs.writeFileSync(p.join(data.outputPath, file), s, 'utf8');
    }

  });

};


