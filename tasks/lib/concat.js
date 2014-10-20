var fs = require('fs');
var p = require('path');
var getFullPaths = require('./getFullPaths');

var topDir = process.cwd();

'use strict';

module.exports = function(grunt, data) {
  var elements = data.configPath.split('/');
  elements.pop();
  var projectDir = elements.join('/');
  //var projectDir = config.basePath;
  var s = fs.readFileSync(data.configPath);
  var config = JSON.parse(s.toString());

  var filePaths = getFullPaths(projectDir, config);
  var s = "";
  for (var i = 0; i < filePaths.length; i++) {
    var path = filePaths[i];
    var file = fs.readFileSync(path, "utf8");
    s += file;
  }
  
  grunt.file.write(data.outputFile, s, {encoding: 'utf8'});

};



